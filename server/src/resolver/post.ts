import { Post } from "../entities/Post"
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { MyContext } from "src/type"

@Resolver()
export default class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext) {
    return em.find(Post, {})
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number, @Ctx() { em }: MyContext) {
    return em.findOne(Post, { id })
  }

  @Mutation(() => Post)
  async createPost(@Arg("title") title: string, @Ctx() { em }: MyContext) {
    const post = em.create(Post, { title })
    await em.persistAndFlush(post)
    return post
  }
}
