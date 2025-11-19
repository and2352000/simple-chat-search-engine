import { DeepPartial } from 'typeorm'
import { dataSource } from "../typeorm/datasource";
import { QA } from "../typeorm/entity/QA";

export class QAStore {
  private readonly qaRepository = dataSource.getRepository(QA);

  async createQA(qa: DeepPartial<QA>): Promise<QA> {
    return this.qaRepository.save(qa);
  }

  async batchCreateQA(qas: DeepPartial<QA>[]): Promise<QA[]> {
    return this.qaRepository.save(qas);
  }

  async searchQA(questionEmbedding: number[]): Promise<QA[]> {
   const p = `[${questionEmbedding.join(',')}]`
    const result = await dataSource.query(`
      SELECT answer, question FROM qa
      ORDER BY question_embedding <-> $1
      LIMIT 5
    `, [p]);
    return result;
  }
}