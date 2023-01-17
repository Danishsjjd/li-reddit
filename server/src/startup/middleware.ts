import RedisStoreFunc from "connect-redis"
import type { Express, Request, Response } from "express"
import session from "express-session"
import { createYoga } from "graphql-yoga"
import { Redis } from "ioredis"
import { buildSchema } from "type-graphql"
import { COOKIE_NAME, __prod__ } from "../constants"
import { HelloResolver } from "../resolver/hello"
import PostResolver from "../resolver/post"
import { UserResolver } from "../resolver/user"
import { MyContext } from "../type"
import cors from "cors"

let RedisStore = RedisStoreFunc(session)
let redis = new Redis()

export default async function (app: Express, em: MyContext["em"]) {
  app.use(cors({ origin: "http://localhost:3000", credentials: true }))
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
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
  let response: null | Response
  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: (): MyContext => ({
      em,
      req: request as Request,
      res: response as Response,
      redis,
    }),
    cors: { origin: "http://localhost:3000" },
  })

  app.use(
    "/graphql",
    (req, res, next) => {
      response = res
      request = req
      next()
    },
    yoga
  )
}
