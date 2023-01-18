import { GraphQLError } from "graphql"
import { MyContext } from "src/type"
import { MiddlewareFn } from "type-graphql"

export const IsAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.session.userId)
    return Promise.reject(new GraphQLError("not authenticated"))

  return next()
}
