import { User } from "../entities/User"
import { MyContext } from "../type"
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from "type-graphql"
import { hash } from "argon2"

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ) {
    console.log(options)
    const hashedPassword = await hash(options.password)
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    })
    await em.persistAndFlush(user)
    return user
  }
}
