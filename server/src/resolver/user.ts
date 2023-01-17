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
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constants"
import { v4 } from "uuid"
import { sendMail } from "../utils/sendMail"

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string

  @Field()
  password: string

  @Field()
  email: string
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

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg("email") email: string,
    @Ctx() { redis, em }: MyContext
  ) {
    const user = await em.findOne(User, { email })
    if (!user) return true
    const token = v4()
    await redis.setex(
      FORGET_PASSWORD_PREFIX + token,
      60 * 15 /* 15min */,
      user.id
    )
    const html = `<a href="http://localhost:3000/change-password/${token}">forget password</a>`
    await sendMail({ html, subject: "reset your password", to: email })
    return true
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.includes("@"))
      return {
        errors: [{ field: "username", message: "username cannot contains @" }],
      }
    if (!options.email.includes("@"))
      return {
        errors: [{ field: "email", message: "invalid email" }],
      }
    const hashedPassword = await hash(options.password)
    const user = em.create(User, {
      username: options.username,
      email: options.email,
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
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(
      User,
      usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail }
    )

    if (!user)
      return {
        errors: [{ message: "user not exists", field: "usernameOrEmail" }],
      }

    const isPasswordMatched = await verify(user.password, password)
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
