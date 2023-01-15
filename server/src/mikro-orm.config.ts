import { MikroORM } from "@mikro-orm/core"
import type { PostgreSqlDriver } from "@mikro-orm/postgresql"
import path from "path"
import { __prod__ } from "./constants"
import { Post } from "./entities/Post"
import { User } from "./entities/User"

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  type: "postgresql",
  name: process.env.DATABASE_UNAME,
  password: process.env.DATABASE_PASS,
  dbName: process.env.DB_NAME,
  entities: [Post, User],
  debug: !__prod__,
} as Parameters<typeof MikroORM.init<PostgreSqlDriver>>[0]
