import { SqlEntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql"
import { Request, Response } from "express"
import { Redis } from "ioredis"

export interface MyContext {
  em: SqlEntityManager<PostgreSqlDriver>
  req: Request
  res: Response
  redis: Redis
}
