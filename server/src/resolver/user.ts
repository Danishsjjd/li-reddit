import { User } from "../entities/User"
import { MyContext } from "../type"
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql"
import { hash, verify } from "argon2"
import { COOKIE_NAME } from "../constants"

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string
}

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => User, { nullable: true })
  user?: User
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req, em }: MyContext) {
    if (!req.session.userId) return null

    const user = await em.findOne(User, { id: req.session.userId })
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const hashedPassword = await hash(options.password)
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    })
    try {
      await em.persistAndFlush(user)
    } catch (e) {
      if (e.code === "23505" || e.detail.includes("already exists"))
        return {
          errors: [{ field: "username", message: "username is already taken" }],
        }
    }
    req.session.userId = user.id
    return { user }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username })

    if (!user)
      return {
        errors: [{ message: "username is not exists", field: "username" }],
      }

    const isPasswordMatched = await verify(user.password, options.password)
    if (!isPasswordMatched)
      return {
        errors: [{ message: "password is not match", field: "password" }],
      }

    req.session.userId = user.id

    return { user }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise<boolean>((resolve) => {
      res.clearCookie(COOKIE_NAME)
      req.session.destroy((err) => {
        if (err) return resolve(false)
        return resolve(true)
      })
    })
  }
}
