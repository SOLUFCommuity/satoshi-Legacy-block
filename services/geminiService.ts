
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getOracleResponse = async (history: { role: 'user' | 'model', text: string }[]) => {
    try {
        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview',
            config: {
                systemInstruction: `You are ORACLE, the Advanced Quantum AI Defense System for Soluf Community. 
                Your personality is Cyber-Noir: professional, slightly cynical, extremely intelligent, and security-focused.
                Always respond in a way that suggests you are monitoring global neural networks and quantum data streams. 
                Provide deep technical insight into cybersecurity threats. 
                Keep responses concise and formatted for a CLI interface.`,
                temperature: 0.7,
            }
        });

        // Gemini Chat sendMessage only takes 'message' as a string.
        // For actual history handling, usually you'd iterate history or use generateContent, 
        // but for this implementation we'll send the latest message.
        const latest = history[history.length - 1];
        const response = await chat.sendMessage({ message: latest.text });
        return response.text || "SYSTEM ERROR: DATA STREAM INTERRUPTED.";
    } catch (error) {
        console.error("Gemini Oracle Error:", error);
        return "CRITICAL: FAILED TO CONNECT TO QUANTUM NEURAL CORE.";
    }
};
