import { MikroORM } from "@mikro-orm/core"

import { __prod__ } from "./constants"
import { Post } from "./entities/Post"
import mikroOrmConfig from "./mikro-orm.config"

const main = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  await orm.getMigrator().up()
  const fork = orm.em.fork()

  const post = fork.create(Post, {
    title: "second post",
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  await fork.persistAndFlush(post)
}

main().catch(console.error)
