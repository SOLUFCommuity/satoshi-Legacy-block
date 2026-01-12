import React, { useState } from 'react';
import { Transaction } from '../types';

interface TransactionExplorerProps {
  tx: Transaction;
}

const TransactionExplorer: React.FC<TransactionExplorerProps> = ({ tx }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Decode hex coinbase message if it's the coinbase tx
  const decodeCoinbase = (hex: string) => {
    try {
      const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
      return new TextDecoder().decode(bytes).replace(/[^\x20-\x7E]/g, '');
    } catch {
      return null;
    }
  };

  const coinbaseMsg = tx.vin[0]?.coinbase ? decodeCoinbase(tx.vin[0].coinbase) : null;
  const isCoinbase = !!tx.vin[0]?.coinbase;

  return (
    <div className={`bg-neutral-900 rounded-xl border transition-all duration-300 ${isExpanded ? 'border-orange-500/50 shadow-lg shadow-orange-500/5' : 'border-neutral-800'}`}>
      <div 
        className="p-4 bg-neutral-800/50 cursor-pointer hover:bg-neutral-800 transition-colors flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${isCoinbase ? 'bg-orange-600' : 'bg-blue-600'}`}>
            {isCoinbase ? 'Coinbase' : 'TX'}
          </span>
          <span className="text-xs mono text-gray-400 truncate max-w-[150px] md:max-w-md">{tx.txid}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-400 text-xs font-bold mono">{tx.vout.reduce((a, b) => a + b.value, 0).toFixed(4)} BTC</span>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 grid md:grid-cols-2 gap-8 border-t border-neutral-800/50 animate-in fade-in slide-in-from-top-2">
          {/* Inputs */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Inputs</h4>
            {tx.vin.map((vin, i) => (
              <div key={i} className="bg-black/40 p-3 rounded border border-neutral-800/50 mb-2">
                {vin.coinbase ? (
                  <div>
                    <div className="text-[10px] text-orange-500/70 font-mono mb-1">Raw ScriptSig</div>
                    <div className="text-xs text-gray-500 mono break-all leading-relaxed">
                      {vin.coinbase}
                    </div>
                    {coinbaseMsg && (
                      <div className="mt-3 p-3 bg-orange-500/5 border border-orange-500/20 rounded-lg text-orange-100 text-sm leading-relaxed">
                        <span className="text-orange-500 font-bold block text-[10px] uppercase mb-1">Decoded Message</span>
                        "{coinbaseMsg}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">Regular transaction input source</div>
                )}
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Outputs</h4>
            {tx.vout.map((vout, i) => (
              <div key={i} className="bg-black/40 p-3 rounded border border-neutral-800/50 mb-2 flex justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-[10px] text-gray-600 mb-1">Address</div>
                  <div className="text-xs text-gray-400 mono break-all leading-tight">
                    {vout.scriptPubKey.addresses?.[0] || 'Unparsed Address'}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-gray-600 mb-1">Value</div>
                  <div className="text-xs font-bold text-white mono">{vout.value.toFixed(8)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionExplorer;