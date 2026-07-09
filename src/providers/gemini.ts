import { GoogleGenAI } from "@google/genai";
import { type ModelAnswer } from "../types.js";

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || "";

const ai = new GoogleGenAI({
  apiKey,
});

export async function askGemini(question: string): Promise<ModelAnswer> {
  const startTime = Date.now();

  try {
    if (!apiKey) {
      throw new Error("Missing Gemini API key. Set GEMINI_API_KEY or GOOGLE_API_KEY.");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
    });
    return {
      provider: "gemini",
      answer: response.text || "",
      latency: Date.now() - startTime,
      success: true,
    };
  } catch (err: any) {
    return {
      provider: "gemini",
      answer: "",
      latency: Date.now() - startTime,
      success: false,
      error: `Error asking Gemini: ${err.message}`,
    };
  }
}
