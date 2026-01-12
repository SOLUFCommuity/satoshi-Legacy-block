
import React, { useState, useRef, useEffect } from 'react';
import { getOracleResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const OracleCLI: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'ORACLE V4.0.2 ONLINE. STANDBY FOR QUANTUM LINK...', timestamp: Date.now() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const highlightText = (text: string) => {
        // Regex for code blocks (```content```)
        const codeBlockRegex = /```([\s\S]*?)```/g;
        // Keywords for cybersecurity highlighting
        const keywords = /\b(CRITICAL|HIGH|WARNING|SUCCESS|THREAT|ENCRYPTION|DECRYPTED|BREACH|FIREWALL|BYPASS|INJECTION|MALWARE|VULNERABILITY)\b/g;

        const parts = text.split(codeBlockRegex);
        
        return parts.map((part, index) => {
            // Every odd index in this split is the content inside backticks
            if (index % 2 === 1) {
                return (
                    <div key={index} className="bg-cyan-950/40 border border-cyan-800/50 p-2 my-2 rounded font-mono text-cyan-300 overflow-x-auto">
                        {part.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                );
            }

            // Handle keywords in normal text
            const subParts = part.split(keywords);
            return (
                <span key={index}>
                    {subParts.map((sub, i) => {
                        if (keywords.test(sub)) {
                            let colorClass = 'text-cyan-400 font-bold';
                            if (sub === 'CRITICAL' || sub === 'BREACH' || sub === 'THREAT') colorClass = 'text-red-500 font-bold';
                            if (sub === 'SUCCESS' || sub === 'DECRYPTED') colorClass = 'text-lime-400 font-bold';
                            if (sub === 'WARNING' || sub === 'VULNERABILITY') colorClass = 'text-yellow-400 font-bold';
                            
                            // Reset regex lastIndex because of test()
                            keywords.lastIndex = 0;
                            return <span key={i} className={colorClass}>{sub}</span>;
                        }
                        return sub;
                    })}
                </span>
            );
        });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        const response = await getOracleResponse([...messages, userMsg].map(m => ({ role: m.role, text: m.text })));
        
        setMessages(prev => [...prev, { role: 'model', text: response, timestamp: Date.now() }]);
        setIsLoading(false);
    };

    return (
        <div className="hologram-glow bg-black p-4 rounded-lg flex flex-col h-full border border-purple-900/30 font-mono text-sm">
            <div className="flex justify-between items-center mb-4 border-b border-purple-900/50 pb-2">
                <span className="neon-magenta font-heading">DEFENSE_ORACLE_CLI</span>
                <span className="text-[10px] text-purple-700">ENCRYPTION: AES-256-QUANTUM</span>
            </div>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
                {messages.map((msg, i) => (
                    <div key={i} className={`${msg.role === 'model' ? 'text-cyan-100' : 'text-purple-400'}`}>
                        <span className="mr-2 opacity-30 text-[10px]">[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
                        <span className="font-bold mr-2">{msg.role === 'model' ? 'ORACLE>' : 'USER>'}</span>
                        <div className="inline whitespace-pre-wrap">{highlightText(msg.text)}</div>
                    </div>
                ))}
                {isLoading && (
                    <div className="text-cyan-400 animate-pulse">
                        <span className="font-bold mr-2">ORACLE></span>
                        <span className="typing">ACCESSING NEURAL CORE...</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSend} className="relative mt-auto">
                <div className="flex items-center gap-2 bg-purple-950/20 p-2 border border-purple-900/50 rounded">
                    <span className="neon-magenta font-bold">{`>`}</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="bg-transparent border-none outline-none flex-1 text-cyan-200 placeholder-purple-800"
                        placeholder="ENTER COMMAND..."
                        disabled={isLoading}
                    />
                    {!isLoading && <div className="cursor-blink" />}
                </div>
            </form>
        </div>
    );
};

export default OracleCLI;
