
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeBlockData = async (blockJson: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this Bitcoin block JSON data and provide educational insights. Focus on:
      1. What makes this specific block unique in Bitcoin history?
      2. Explanation of technical fields like coinbase (including hex decoding), merkleroot, and bits.
      3. The historical significance of any messages hidden in the 'coinbase' transaction.
      4. Technical trivia related to the block height or nonce.
      
      Block Data:
      ${blockJson}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  field: { type: Type.STRING }
                },
                required: ["title", "description", "field"]
              }
            },
            historicalNote: { type: Type.STRING }
          },
          required: ["insights", "historicalNote"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};
