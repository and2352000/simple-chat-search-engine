import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import path from 'path'
import cfg from '../config'

export const dataSource = new DataSource({
  type: 'postgres',
  host: cfg.POSTGRES_HOST,
  database: cfg.POSTGRES_DB,
  entities: [path.join(__dirname, '/entity/**/*{.js,.ts}')],
  migrations: [path.join(__dirname, '/migration/*{.js,.ts}')],
  username: cfg.POSTGRES_USER,
  password: cfg.POSTGRES_PASSWORD,
  logging: cfg.DEBUG_LOG,
  synchronize: false,
  port: cfg.POSTGRES_PORT,
  namingStrategy: new SnakeNamingStrategy(),
})
