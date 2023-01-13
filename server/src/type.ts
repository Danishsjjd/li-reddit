import { SqlEntityManager, PostgreSqlDriver } from "@mikro-orm/postgresql"

export interface MyContext {
  em: SqlEntityManager<PostgreSqlDriver>
}
