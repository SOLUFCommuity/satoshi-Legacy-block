
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GENESIS_BLOCK, Icons } from './constants';
import { Block, Analysis } from './types';
import BlockCard from './components/BlockCard';
import TransactionExplorer from './components/TransactionExplorer';
import { analyzeBlockData } from './services/geminiService';
import { fetchBlockByHash, fetchBlockByHeight } from './services/bitcoinService';

const App: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState<Block>(GENESIS_BLOCK);
  const [analysis, setAnalysis] = useState<{ insights: Analysis[], historicalNote: string } | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [loadingBlock, setLoadingBlock] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAnalyze = useCallback(async (block: Block) => {
    setLoadingAnalysis(true);
    setAnalysis(null);
    const result = await analyzeBlockData(JSON.stringify(block, null, 2));
    setAnalysis(result);
    setLoadingAnalysis(false);
  }, []);

  const goToBlock = async (identifier: string | number) => {
    if (loadingBlock) return;
    setLoadingBlock(true);
    let block: Block | null = null;
    
    try {
      if (typeof identifier === 'number') {
        block = await fetchBlockByHeight(identifier);
      } else {
        const trimmed = identifier.trim();
        if (/^\d+$/.test(trimmed)) {
          block = await fetchBlockByHeight(parseInt(trimmed, 10));
        } else {
          block = await fetchBlockByHash(trimmed);
        }
      }

      if (block) {
        setActiveBlock(block);
        handleAnalyze(block);
        setSearchQuery('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert("Could not find that block. Check the height or hash and try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBlock(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    goToBlock(searchQuery.trim());
  };

  const resetToGenesis = () => {
    if (activeBlock.hash === GENESIS_BLOCK.hash || loadingBlock) return;
    setActiveBlock(GENESIS_BLOCK);
    handleAnalyze(GENESIS_BLOCK);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    handleAnalyze(GENESIS_BLOCK);
  }, [handleAnalyze]);

  return (
    <div className="min-h-screen pb-20 relative">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer group shrink-0" onClick={resetToGenesis}>
            <Icons.Bitcoin />
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-yellow-200 bg-clip-text text-transparent group-hover:from-orange-300 group-hover:to-white transition-all">
              Satoshi Explorer
            </h1>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-orange-500 transition-colors">
                <Icons.Search />
              </div>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search height or hash..."
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-all text-gray-200"
              />
            </div>
          </form>

          <div className="flex items-center gap-4 shrink-0">
            <div className="hidden sm:flex gap-2">
              <button 
                onClick={() => setViewMode('visual')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === 'visual' ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'text-gray-400 hover:text-white hover:bg-neutral-800'}`}
              >
                Visual
              </button>
              <button 
                onClick={() => setViewMode('raw')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${viewMode === 'raw' ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'text-gray-400 hover:text-white hover:bg-neutral-800'}`}
              >
                Raw
              </button>
            </div>
          </div>
        </div>
        {loadingBlock && (
          <div className="absolute bottom-0 left-0 h-0.5 bg-orange-500 w-full animate-pulse origin-left transition-all duration-300"></div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-neutral-900/60 p-2 rounded-xl border border-neutral-800/60 backdrop-blur-sm shadow-xl">
           <div className="flex items-center gap-2">
              <button 
                onClick={resetToGenesis}
                disabled={activeBlock.hash === GENESIS_BLOCK.hash || loadingBlock}
                className="flex items-center gap-2 bg-neutral-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-neutral-700 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-neutral-700"
                title="Back to Genesis Block"
              >
                <Icons.Home />
                <span className="hidden sm:inline">Genesis</span>
              </button>
              
              <div className="h-8 w-px bg-neutral-800 mx-1 hidden sm:block"></div>
              
              <div className="flex items-center gap-2 px-3 py-2 bg-neutral-950/40 rounded-lg border border-neutral-800 text-xs font-medium">
                <span className="text-gray-500">Block</span>
                <span className="text-orange-500 mono font-bold text-sm tabular-nums transition-all duration-500 transform scale-110">
                  {activeBlock.height.toLocaleString()}
                </span>
              </div>
           </div>

           <div className="flex items-center gap-2">
              <button 
                disabled={!activeBlock.prevblockhash || loadingBlock}
                onClick={() => goToBlock(activeBlock.prevblockhash)}
                className="flex items-center gap-2 bg-white/5 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed border border-white/10"
              >
                <Icons.ArrowLeft />
                <span className="hidden xs:inline">Prev</span>
              </button>

              <button 
                disabled={!activeBlock.nextblockhash || loadingBlock}
                onClick={() => goToBlock(activeBlock.nextblockhash)}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-orange-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
              >
                <span className="hidden xs:inline">Next</span>
                <Icons.ArrowRight />
              </button>
           </div>
        </div>

        {loadingBlock ? (
          <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in duration-300">
            <div className="relative mb-8">
               <div className="h-24 w-24 border-4 border-orange-500/10 rounded-full"></div>
               <div className="absolute top-0 h-24 w-24 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <Icons.Bitcoin />
               </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Syncing with Node...</h2>
            <p className="text-gray-400 max-w-xs mx-auto">Retrieving block data and validating chain proof-of-work.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {viewMode === 'visual' ? (
                <>
                  <BlockCard block={activeBlock} />
                  
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Icons.Code />
                        Transactions
                      </h3>
                      <span className="bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded text-xs mono">
                        {activeBlock.tx.length} Count
                      </span>
                    </div>
                    <div className="space-y-4">
                      {activeBlock.tx.map(tx => (
                        <TransactionExplorer key={tx.txid} tx={tx} />
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <div className="bg-neutral-950 p-6 rounded-xl border border-neutral-800 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2 text-[10px] uppercase font-bold text-neutral-700 pointer-events-none">Block Object JSON</div>
                  <pre className="text-xs md:text-sm mono text-gray-400 overflow-auto max-h-[75vh] scrollbar-thin">
                    {JSON.stringify(activeBlock, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Icons.Sparkle />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2 text-orange-400 uppercase text-xs tracking-widest">
                    <Icons.Sparkle />
                    Gemini Intelligence
                  </h3>
                  {loadingAnalysis && (
                    <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full" />
                  )}
                </div>
                
                {!analysis && !loadingAnalysis && (
                  <button 
                    onClick={() => handleAnalyze(activeBlock)}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all border border-neutral-700 flex items-center justify-center gap-2"
                  >
                    Generate Insights
                  </button>
                )}

                {analysis && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                      <p className="text-[10px] text-orange-500 font-black uppercase mb-2 tracking-tighter">Significance Report</p>
                      <p className="text-sm text-gray-300 leading-relaxed italic">
                        {analysis.historicalNote}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {analysis.insights.map((insight, idx) => (
                        <div key={idx} className="relative pl-4 border-l-2 border-orange-500/30 py-1 hover:border-orange-500 transition-colors">
                          <h4 className="text-sm font-bold text-white mb-1">{insight.title}</h4>
                          <p className="text-xs text-gray-400 mb-2 leading-relaxed">{insight.description}</p>
                          <span className="bg-neutral-800 px-2 py-0.5 rounded text-[10px] mono text-neutral-500">
                            Context: {insight.field}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loadingAnalysis && (
                  <div className="space-y-6">
                    <div className="h-24 bg-neutral-800/50 rounded-xl animate-pulse" />
                    {[1, 2].map(i => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 bg-neutral-800/50 rounded w-1/2 animate-pulse" />
                        <div className="h-10 bg-neutral-800/50 rounded w-full animate-pulse" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-neutral-900/50 border border-neutral-800/50 rounded-xl p-6 text-sm text-gray-400 shadow-md">
                <h4 className="text-white font-bold mb-3 flex items-center gap-2 uppercase text-xs tracking-widest">
                  <Icons.Info />
                  Chain Integrity
                </h4>
                <div className="space-y-4">
                  <div className="p-3 bg-black/40 rounded border border-neutral-800/50">
                    <span className="text-[10px] uppercase font-bold text-gray-600 block mb-1">Previous Block Hash</span>
                    <span className="text-[10px] mono break-all text-gray-500">
                      {activeBlock.prevblockhash || '0000000000000000000000000000000000000000000000000000000000000000'}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-neutral-800/50 flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-gray-600">Block Era</span>
                        <span className="text-gray-400 font-bold">{(new Date().getFullYear() - new Date(activeBlock.time * 1000).getFullYear())} Yrs Ago</span>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] uppercase font-bold text-gray-600">Proof Scale</span>
                         <span className="text-orange-500 font-mono text-xs block">99.9% Reliable</span>
                      </div>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-600 to-orange-400 h-full w-[100%] transition-all duration-1000"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => window.open('https://bitcoin.org/bitcoin.pdf', '_blank')}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95 group border border-orange-400"
        >
          <Icons.Info />
          <span className="hidden sm:inline">Bitcoin Whitepaper</span>
          <span className="sm:hidden">Whitepaper</span>
        </button>
      </div>
    </div>
  );
};

export default App;
