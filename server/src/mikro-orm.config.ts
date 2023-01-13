import { MikroORM } from "@mikro-orm/core"
import type { PostgreSqlDriver } from "@mikro-orm/postgresql"
import path from "path"

import { __prod__ } from "./constants"
import { Post } from "./entities/Post"

export default {
  migrations: {
    path: path.join(__dirname, "./migrations"),
    glob: "!(*.d).{js,ts}",
  },
  type: "postgresql",
  name: "postgres",
  password: "postgres",
  dbName: "lireddit",
  entities: [Post],
  debug: !__prod__,
} as Parameters<typeof MikroORM.init<PostgreSqlDriver>>[0]
