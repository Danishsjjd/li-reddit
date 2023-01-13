import { MikroORM } from "@mikro-orm/core"

import mikroOrmConfig from "../mikro-orm.config"

const dbConnectAndMigrate = async () => {
  const orm = await MikroORM.init(mikroOrmConfig)
  await orm.getMigrator().up()
}

export default dbConnectAndMigrate
