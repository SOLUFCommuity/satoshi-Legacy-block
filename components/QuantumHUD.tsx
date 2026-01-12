
import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';

const QuantumHUD: React.FC = () => {
    const [decryptionProgress, setDecryptionProgress] = useState(0);
    const [activeNodes, setActiveNodes] = useState(128);

    useEffect(() => {
        const interval = setInterval(() => {
            setDecryptionProgress(prev => (prev + Math.random() * 2) % 100);
            setActiveNodes(prev => prev + (Math.random() > 0.5 ? 1 : -1));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    // Simulated visualization using CSS & SVG
    return (
        <div className="hologram-glow bg-black/40 p-4 rounded-lg flex flex-col h-full border border-lime-900/30 overflow-hidden relative">
            <h2 className="font-heading text-xl neon-lime mb-4">QUANTUM_DIADICATIONS</h2>
            
            <div className="grid grid-cols-2 gap-4 flex-1">
                {/* Visualizer 1: Circular Progress */}
                <div className="flex flex-col items-center justify-center border border-lime-900/20 rounded p-2">
                    <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
                        <circle
                            cx="50" cy="50" r="40"
                            stroke="#1a2e05" strokeWidth="8" fill="transparent"
                        />
                        <circle
                            cx="50" cy="50" r="40"
                            stroke="#32ff7e" strokeWidth="8" fill="transparent"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * decryptionProgress) / 100}
                            className="transition-all duration-500 ease-linear"
                        />
                    </svg>
                    <span className="text-[10px] mt-2 neon-lime">DECRYPTING... {decryptionProgress.toFixed(1)}%</span>
                </div>

                {/* Visualizer 2: Waveform Simulation */}
                <div className="flex flex-col justify-center border border-lime-900/20 rounded p-2 overflow-hidden">
                    <div className="flex items-end gap-1 h-12 w-full">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-lime-500/50 w-full rounded-t"
                                style={{
                                    height: `${Math.random() * 100}%`,
                                    transition: 'height 0.3s ease'
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] mt-2 text-lime-600 text-center">FREQUENCY ANALYSIS</span>
                </div>

                {/* Status List */}
                <div className="col-span-2 text-[10px] space-y-1 mt-2">
                    <div className="flex justify-between border-b border-lime-900/20 pb-1">
                        <span className="text-lime-700">ACTIVE_NODES:</span>
                        <span className="neon-lime">{activeNodes}</span>
                    </div>
                    <div className="flex justify-between border-b border-lime-900/20 pb-1">
                        <span className="text-lime-700">ENTROPY_LVL:</span>
                        <span className="text-yellow-500">STABLE</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-lime-700">CORE_TEMP:</span>
                        <span className="text-red-500">2.4K</span>
                    </div>
                </div>
            </div>

            {/* Background Data Stream Effect */}
            <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden text-[8px] text-lime-400 select-none">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="whitespace-nowrap animate-pulse">
                        {Math.random().toString(2).repeat(10)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuantumHUD;
