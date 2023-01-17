import { SqlEntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql"
import { Request, Response } from "express"

export interface MyContext {
  em: SqlEntityManager<PostgreSqlDriver>
  req: Request
  res: Response
}
