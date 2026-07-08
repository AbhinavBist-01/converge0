import { GoogleGenAI } from "@google/genai";
import { type ModelAnswer } from "../types.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
});

export async function askGemini(question: string): Promise<ModelAnswer> {
  const startTime = Date.now();

  try {
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
