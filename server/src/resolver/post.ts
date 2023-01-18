import { IsAuth } from "../middleware/isAuth"
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql"
import { Post } from "../entities/Post"
import { MyContext } from "src/type"

@InputType()
class PostInputs {
  @Field()
  title: string

  @Field()
  points?: number

  @Field()
  text: string
}

@Resolver()
export default class PostResolver {
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return Post.find({})
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number): Promise<Post | null> {
    return Post.findOne({ where: { id } })
  }

  @Mutation(() => Post)
  @UseMiddleware(IsAuth)
  async createPost(
    @Arg("inputs") inputs: PostInputs,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return await Post.create({
      ...inputs,
      creatorId: req.session.userId,
    }).save()
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number
    // @Arg("inputs") inputs: PostInputs
  ): Promise<Post | null> {
    const post = await Post.findOne({ where: { id } })
    if (!post) return null

    await post.save()
    return post
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("id") id: number): Promise<boolean> {
    await Post.delete(id)
    return true
  }
}
