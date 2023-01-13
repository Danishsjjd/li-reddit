import { ApolloServer } from "apollo-server-express"
import type { Express } from "express"
import { MyContext } from "src/type"
import { buildSchema } from "type-graphql"

import { HelloResolver } from "../resolver/hello"
import PostResolver from "../resolver/post"

export default async function (app: Express, em: MyContext["em"]) {
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      // validate: false,
    }),
    context: () => ({ em }),
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })
}
