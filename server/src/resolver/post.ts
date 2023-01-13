import { Post } from "../entities/Post"
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql"
import { MyContext } from "src/type"
import { Loaded } from "@mikro-orm/core"

@Resolver()
export default class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Loaded<Post>[]> {
    return em.find(Post, {})
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<Loaded<Post | null>> {
    return em.findOne(Post, { id })
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Loaded<Post>> {
    const post = em.create(Post, { title })
    await em.persistAndFlush(post)
    return post
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Loaded<Post | never> | null> {
    const post = await em.findOne(Post, { id })
    if (!post) return null
    post.title = title
    await em.persistAndFlush(post)
    return post
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id })
    return true
  }
}
