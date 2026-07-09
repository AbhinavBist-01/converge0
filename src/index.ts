import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { askClaude } from "./providers/claude.js";
import { askOpenAI } from "./providers/openai.js";
import { askGemini } from "./providers/gemini.js";
import { judgeFinalAnswer } from "./judge.js";

async function main(): Promise<void> {
  const rl = createInterface({ input, output });

  try {
    while (true) {
      const userQuery = await rl.question(
        "\nEnter your query (type 'exit' to quit): ",
      );
      const trimmedQuery = userQuery.trim();

      if (trimmedQuery.toLowerCase() === "exit") {
        break;
      }

      if (trimmedQuery === "") {
        console.log("Query cannot be empty. Please enter a valid question.");
        continue;
      }

      console.log("\nFetching answers from providers...");
      const modelAnswers = await Promise.all([
        askOpenAI(trimmedQuery),
        askGemini(trimmedQuery),
      ]);

      // Print warning if any provider failed
      for (const ans of modelAnswers) {
        if (!ans.success) {
          console.warn(
            `[Warning] Provider ${ans.provider} failed: ${ans.error}`,
          );
        }
      }

      try {
        console.log("Judging the best answer...");
        const finalAnswerFromJudge = await judgeFinalAnswer(
          trimmedQuery,
          modelAnswers,
        );

        console.log(
          `\nBest Answer: ${finalAnswerFromJudge.finalAnswer} \n\nTokens Used: Input - ${finalAnswerFromJudge.tokens.input}, Output - ${finalAnswerFromJudge.tokens.output}`,
        );
      } catch (err: any) {
        console.error(`\n[Error] Judging failed: ${err.message}`);
      }
    }
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
