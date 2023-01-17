import "reflect-metadata"
import { DataSource } from "typeorm"
import { __prod__ } from "../constants"
import { Post } from "../entities/Post"
import { User } from "../entities/User"

const dbConnectAndMigrate = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DATABASE_UNAME,
  password: process.env.DATABASE_PASS,
  database: "lireddit2",
  entities: [Post, User],
  synchronize: true,
  logging: !__prod__,
})

export default dbConnectAndMigrate
