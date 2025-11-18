import { DeepPartial} from 'typeorm'
import { dataSource } from "../typeorm/datasource";
import { QA } from "../typeorm/entity/QA";

export class QAStore {
  private readonly qaRepository = dataSource.getRepository(QA);

  async createQA(qa: DeepPartial<QA>): Promise<QA> {
    return this.qaRepository.save(qa);
  }
}