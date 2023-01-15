import type { Express } from "express"
import { createYoga } from "graphql-yoga"
import { UserResolver } from "../resolver/user"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "../resolver/hello"
import PostResolver from "../resolver/post"
import { MyContext } from "../type"

export default async function (app: Express, em: MyContext["em"]) {
  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({}) => ({ em }),
  })

  app.use("/graphql", yoga)
}
