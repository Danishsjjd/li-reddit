import { ApolloServer } from "apollo-server-express"
import type { Express } from "express"
import { buildSchema } from "type-graphql"

import { HelloResolver } from "../resolver/hello"

export default async function (app: Express) {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
      validate: false,
    }),
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}
