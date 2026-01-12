
import React from 'react';
import ThreatFeed from './components/ThreatFeed';
import OracleCLI from './components/OracleCLI';
import QuantumHUD from './components/QuantumHUD';

const App: React.FC = () => {
    return (
        <div className="relative min-h-screen p-4 md:p-8 flex flex-col gap-6 z-10">
            {/* Background elements */}
            <div className="hex-grid" />
            <div className="scanline" />

            {/* Top Bar / Header */}
            <header className="flex flex-col md:flex-row justify-between items-center border-b border-cyan-900 pb-4 mb-4 gap-4">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-heading font-bold neon-blue tracking-tighter">
                        SOLUF <span className="text-white">QUANTUM HUB</span>
                    </h1>
                    <span className="text-[10px] text-cyan-600 font-mono">ESTABLISHING SECURE CONNECTION... VERIFIED</span>
                </div>
                
                <div className="flex gap-6 items-center">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-cyan-700 uppercase">System Status</div>
                        <div className="neon-lime text-xs font-bold flex items-center gap-1 justify-end">
                            <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
                            NOMINAL
                        </div>
                    </div>
                    <div className="bg-cyan-950/30 border border-cyan-800 p-2 rounded text-[10px] text-cyan-400">
                        LATENCY: 14ms
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Threat Intelligence */}
                <div className="lg:col-span-3 order-2 lg:order-1 h-[400px] lg:h-auto">
                    <ThreatFeed />
                </div>

                {/* Middle: AI Oracle CLI */}
                <div className="lg:col-span-6 order-1 lg:order-2 h-[500px] lg:h-auto">
                    <OracleCLI />
                </div>

                {/* Right: Quantum Analytics HUD */}
                <div className="lg:col-span-3 order-3 lg:order-3 h-[400px] lg:h-auto">
                    <QuantumHUD />
                </div>
            </main>

            {/* Footer Status Bar */}
            <footer className="mt-auto border-t border-cyan-900 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-cyan-800 gap-2">
                <div>© 2025 SOLUF_COMMUNITY_SYSTEMS_INTL</div>
                <div className="flex gap-4">
                    <span className="hover:text-cyan-500 cursor-pointer">NODE: SG-01</span>
                    <span className="hover:text-cyan-500 cursor-pointer">SEC_LEVEL: ALPHA</span>
                    <span className="neon-magenta animate-pulse cursor-pointer underline">EMERGENCY_OVERRIDE</span>
                </div>
            </footer>
        </div>
    );
};

export default App;
