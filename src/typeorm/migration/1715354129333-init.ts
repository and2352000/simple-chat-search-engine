import { type MigrationInterface, type QueryRunner } from 'typeorm'
// Postgres
export class Init1715354129333 implements MigrationInterface {
  name = 'Init1715354129333'

  public async up (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "qa" (
            "id" serial PRIMARY KEY,
            "question" character varying NOT NULL,
            "answer" character varying NOT NULL,
            "question_embedding" vector NOT NULL,
            "created_at" timestamp without time zone DEFAULT now() NOT NULL,
            "updated_at" timestamp without time zone DEFAULT now() NOT NULL,
            "deleted_at" timestamp DEFAULT NULL
        )`)
       
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "qa"')
  }
}
