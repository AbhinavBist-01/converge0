import { Anthropic } from "@anthropic-ai/sdk";
import type { JudgeResult, ModelAnswer } from "./types.js";

const claude = new Anthropic();

export async function judgeFinalAnswer(
  question: string,
  answers: ModelAnswer[],
): Promise<JudgeResult> {
  const SYSTEM_PROMPT = `

    Question : 
    ${question}

    Candidate Answers:
     ${answers
       .map(
         (ans, i) => `
     Answer ${i + 1} (${ans.provider}):
     ${ans.answer}
`,
       )
       .join("\n")}


    You are the judge that evaluates the quality of the answers provided , by the different models .
    You will be given with question and the answers provided by the different models.
    You have to check the answers of all the models and provide the best answer using the provided answers.
    You anser should be :
    - The best among the provided answers .
    - Should be in the same language and style as the provided answers.
    - Should be clear and concise .
    

    RULES:
    - Check the answers of all the models and provide the best answer using the provided answers.
    - Merge the strongest part of the provided answers .
    - If answers disagree, determine which is most likely correct.
    - Should not provide any new information that is not present in the provided answers.
    - Should not provide any personal opinions or biases.
    - The answer should not contain any offensive , religious or political content.
    - Provide the answer in a clear and concise manner.
    
    EXAMPLE:
    Question : What is the capital of France?
    Answer : Paris is the capital of France.

    Question : What is JSON Web Token?
    Answer : JSON Web Token (JWT) is an open standard for securely transmitting information between parties as a JSON object. It is primarily used for authentication and authorization in web applications, allowing clients to prove their identity to servers without requiring the server to maintain session state.
    
    
    `;

  const stream = await claude.messages.stream({
    model: "claude-sonnet-4-5", // or "claude-sonnet-5" for the latest
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: question }],
  });

  const message = await stream.finalMessage();

  return {
    finalAnswer:
      message.content[0]?.type === "text" ? message.content[0].text : "",
    tokens: {
      input: message.usage.input_tokens,
      output: message.usage.output_tokens,
    },
  };
}
