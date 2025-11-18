import { QAStore } from "../store/qa";
import config from "../config";
import { OpenAI } from "openai";

export class QAService {
  constructor(
    private readonly qaStore: QAStore,
    private readonly openaiClient: OpenAI
  ) {}
 static getInstance(): QAService {
    const openaiClient = new OpenAI({
        apiKey: config.OPENAI_API_KEY,
      });
    return new QAService(new QAStore(),openaiClient);
  }
  async createQA(qa: { question: string, answer: string }): Promise<any> {
    const embedding = await this.openaiClient.embeddings.create({
        model: "text-embedding-3-small",
        input: qa.question,
    });
    // return {
    //     question: qa.question,
    //     answer: qa.answer,
    //     questionEmbedding: embedding.data[0].embedding,
    // };
    return this.qaStore.createQA({ ...qa, questionEmbedding: embedding.data[0].embedding });
  }
}