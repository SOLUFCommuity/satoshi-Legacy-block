
import React, { useState, useEffect } from 'react';
import { Threat } from '../types';

const ThreatFeed: React.FC = () => {
    const [threats, setThreats] = useState<Threat[]>([]);

    useEffect(() => {
        const targets = ['Mainframe-X1', 'Global_Relay_7', 'Quantum_Core_0', 'Neural_Node_B', 'Encryption_Layer_9'];
        const types = ['SQL Injection Attempt', 'Brute Force Breach', 'DDoS Vector Detected', 'Malware Signature Found', 'Unauthorized Access'];
        
        const generateThreat = (): Threat => ({
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            target: targets[Math.floor(Math.random() * targets.length)],
            severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][Math.floor(Math.random() * 4)] as any,
            status: 'ACTIVE',
            description: types[Math.floor(Math.random() * types.length)],
            timestamp: new Date().toLocaleTimeString(),
        });

        setThreats(Array.from({ length: 5 }, generateThreat));

        const interval = setInterval(() => {
            setThreats(prev => [generateThreat(), ...prev.slice(0, 7)]);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case 'CRITICAL': return 'text-red-500';
            case 'HIGH': return 'neon-magenta';
            case 'MEDIUM': return 'text-yellow-400';
            default: return 'neon-lime';
        }
    };

    return (
        <div className="hologram-glow bg-black/40 p-4 rounded-lg overflow-hidden flex flex-col h-full border border-cyan-900/50">
            <h2 className="font-heading text-xl neon-blue mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full threat-pulse"></span>
                THREAT INTELLIGENCE FEED
            </h2>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {threats.map((threat) => (
                    <div key={threat.id} className="border-l-2 border-cyan-800 bg-cyan-950/20 p-3 text-xs space-y-1 transition-all hover:bg-cyan-900/30">
                        <div className="flex justify-between items-center">
                            <span className="text-cyan-600 font-bold">ID: {threat.id}</span>
                            <span className={`font-bold ${getSeverityColor(threat.severity)}`}>{threat.severity}</span>
                        </div>
                        <div className="text-white font-semibold">{threat.description}</div>
                        <div className="text-cyan-500/70">Target: {threat.target}</div>
                        <div className="text-[10px] text-cyan-800 text-right">{threat.timestamp}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThreatFeed;
