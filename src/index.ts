import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import express from "express";
import type { UserQuery } from "./types.js";
import { askClaude } from "./providers/claude.js";
import { askOpenAI } from "./providers/openai.js";
import { askGemini } from "./providers/gemini.js";
import { judgeFinalAnswer } from "./judge.js";

const PORT = process.env.PORT;

const app = express();
app.use(express.json());

async function main(query: UserQuery): Promise<void> {
  const rl = createInterface({ input, output });
  const userQuery = await rl.question("Enter your query: \n\n");
  rl.close();

  const modelAnswers = await Promise.all([
    askClaude(userQuery),
    askOpenAI(userQuery),
    askGemini(userQuery),
  ]);

  const finalAnswerFromJudge = await judgeFinalAnswer(userQuery, modelAnswers);

  console.log(
    `Best Answer: ${finalAnswerFromJudge.finalAnswer} \n\n Tokens Used: Input - ${finalAnswerFromJudge.tokens.input}, Output - ${finalAnswerFromJudge.tokens.output}`,
  );

  console.log(`Query received: ${userQuery}`);
}
main({ query: "" });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
