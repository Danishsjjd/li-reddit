import type { Express } from "express"
import { MyContext } from "src/type"
import { buildSchema } from "type-graphql"
import { createYoga } from "graphql-yoga"

import { HelloResolver } from "../resolver/hello"
import PostResolver from "../resolver/post"

export default async function (app: Express, em: MyContext["em"]) {
  const yoga = createYoga({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      // validate: false,
    }),
    context: () => ({ em }),
  })

  app.use("/graphql", yoga)
}
