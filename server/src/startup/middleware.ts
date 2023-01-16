import RedisStoreFunc from "connect-redis"
import type { Express, Request } from "express"
import session from "express-session"
import { createYoga } from "graphql-yoga"
import { createClient } from "redis"
import { buildSchema } from "type-graphql"
import { __prod__ } from "../constants"
import { HelloResolver } from "../resolver/hello"
import PostResolver from "../resolver/post"
import { UserResolver } from "../resolver/user"
import { MyContext } from "../type"

let RedisStore = RedisStoreFunc(session)
let redisClient = createClient({ legacyMode: true })
redisClient.connect().catch(console.error)

export default async function (app: Express, em: MyContext["em"]) {
  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redisClient, disableTouch: true }),
      saveUninitialized: false,
      secret: process.env.SECRET_KEY || "secret key",
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
    })
  )
  let request: null | Request
  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: (): MyContext => ({ em, req: request as Request }),
  })

  app.use(
    "/graphql",
    (req, _, next) => {
      request = req
      next()
    },
    yoga
  )
}
