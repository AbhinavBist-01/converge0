import Anthropic from "@anthropic-ai/sdk";
import type { ModelAnswer } from "../types.js";
const client = new Anthropic();

export async function askClaude(question: string): Promise<ModelAnswer> {
  const startTime = Date.now();
  try {
    const response = await client.messages.create({
      max_tokens: 1000,
      model: "claude-sonnet-4-5",
      messages: [{ role: "user", content: question }],
    });

    return {
      provider: "anthropic",
      answer:
        response.content[0]?.type === "text" ? response.content[0].text : "",
      latency: Date.now() - startTime,
      success: true,
    };
  } catch (err: any) {
    return {
      provider: "anthropic",
      answer: "",
      latency: Date.now() - startTime,
      success: false,
      error: `Error asking Claude: ${err.message}`,
    };
  }
}
