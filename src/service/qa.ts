import { QAStore } from "../store/qa";
import config from "../config";
import { OpenAI } from "openai";


const MODEL = "text-embedding-3-large";

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

  private async getEmbedding(input: string): Promise<number[]> {
    const embedding = await this.openaiClient.embeddings.create({
        model: MODEL,
        input: input,
    });
    return embedding.data[0].embedding;
  }

  async createQA(qa: { question: string, answer: string }): Promise<any> {
    const embedding = await this.getEmbedding(qa.question);
    return this.qaStore.createQA({ ...qa, questionEmbedding: embedding });
  }

  async batchCreateQA(qas: { question: string, answer: string }[]): Promise<any> {
    const embeddings = await Promise.all(qas.map(qa => this.getEmbedding(qa.question)));
    return this.qaStore.batchCreateQA(qas.map((qa, index) => ({ ...qa, questionEmbedding: embeddings[index] })));
  }

  async searchQA(question: string): Promise<any> {
    const embedding = await this.getEmbedding(question);
    const result = await this.qaStore.searchQA(embedding);
    return result;
  }
}