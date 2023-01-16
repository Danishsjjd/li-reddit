import RedisStoreFunc from "connect-redis"
import type { Express } from "express"
import session from "express-session"
import { createYoga } from "graphql-yoga"
import { createClient } from "redis"
import { __prod__ } from "../constants"
import { buildSchema } from "type-graphql"
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
        maxAge: Infinity,
        httpOnly: true,
        secure: __prod__,
        sameSite: "lax",
      },
    })
  )
  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ request: req }) => ({ em, req }),
  })

  app.use("/graphql", yoga)
}
