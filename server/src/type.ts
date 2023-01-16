import { SqlEntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql"
import { Request } from "express"

export interface MyContext {
  em: SqlEntityManager<PostgreSqlDriver>
  req: Request
}
