import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'

@Entity()
export class QA extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number

  @Column()
    question: string

  @Column()
    answer: string

  @Column("vector")
    questionEmbedding: number[]
}
