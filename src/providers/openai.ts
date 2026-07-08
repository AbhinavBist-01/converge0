import OpenAI from "openai";
import type { ModelAnswer } from "../types.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function askOpenAI(question: string): Promise<ModelAnswer> {
  const startTime = Date.now();
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: question,
    });
    return {
      provider: "openai",
      answer: response.output_text || "",
      latency: Date.now() - startTime,
      success: true,
    };
  } catch (err: any) {
    return {
      provider: "openai",
      answer: "",
      latency: Date.now() - startTime,
      success: false,
      error: `Error asking OpenAI: ${err.message}`,
    };
  }
}
