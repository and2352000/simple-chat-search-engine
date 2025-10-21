import config from "./config";
import { ChatOpenAI } from "@langchain/openai";

import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph";

import { v4 as uuidv4 } from "uuid";

// import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0, apiKey: process.env.OPENAI_API_KEY });
const llm = new ChatOpenAI({ model: "gpt-5-mini-2025-08-07", temperature: 1, apiKey: config.OPENAI_API_KEY });

//NOTE: chat example
// const result = await llm.invoke([
//   { role: "user", content: "Hi! I'm Bob" },
//   { role: "assistant", content: "Hello Bob! How can I assist you today?" },
//   { role: "user", content: "What's my name?" },
// ]);

// console.log(result.content);

async function bootstrap() {

// Define the function that calls the model

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", async (state) => {
    const response = await llm.invoke(state.messages);
    return { messages: response };
  })
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

const config = { configurable: { thread_id: uuidv4() } };

const input = [
  {
    role: "user",
    content: "Hi! I'm Bob.",
  },
];
const output = await app.invoke({ messages: input }, config);
// The output contains all messages in the state.
// This will log the last message in the conversation.
// console.log(output.messages[output.messages.length - 1]);

const input2 = [
  {
    role: "user",
    content: "What's my name?",
  },
];
const output2 = await app.invoke({ messages: input2 }, config);
console.log(output2.messages);
// console.log(output2.messages[output2.messages.length - 1]);


}
bootstrap();