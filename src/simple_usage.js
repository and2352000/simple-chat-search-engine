import dotenv from "dotenv";
dotenv.config();

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatOpenAI({ model: "gpt-4o-mini", apiKey: process.env.OPENAI_API_KEY });

import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const messages = [
  new SystemMessage("Translate the following from English into Chinese"),
  new HumanMessage("hi!"),
];
//NOTE: invoke model
// const result = await model.invoke(messages);
// console.log(result.content);

// stream output
// const stream = await model.stream(messages);

// const chunks = [];
// for await (const chunk of stream) {
//   chunks.push(chunk);
//   console.log(`${chunk.content}|`);
// }


//prompt template
const systemTemplate = "Translate the following from English into {language}";
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"],
  ]);

  const promptValue = await promptTemplate.invoke({
    language: "繁體中文",
    text: "Who am i ?",
  });

  const result = await model.invoke(promptValue);

  console.log(result.content);