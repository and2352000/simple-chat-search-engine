import {
  CreateDateColumn, UpdateDateColumn, DeleteDateColumn
} from 'typeorm'
import { timeTransformer } from '../../typeorm/type/decorator'

export class BaseEntity {
  @CreateDateColumn({
    default: Date.now().toString(),
    transformer: timeTransformer
  })
  public createdAt: string

  @UpdateDateColumn({
    default: Date.now().toString(),
    onUpdate: Date.now().toString(),
    transformer: timeTransformer
  })
  public updatedAt: string

  @DeleteDateColumn()
  public deletedAt?: string
}
