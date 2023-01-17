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
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) return null

    return User.findOne({ where: { id: req.session.userId } })
  }

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } })
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
  async resetPassword(
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const key = FORGET_PASSWORD_PREFIX + token
    const haveToken = await redis.get(key)
    if (!haveToken)
      return {
        errors: [{ field: "token", message: "token is expire" }],
      }
    const user = await User.findOne({ where: { id: parseInt(haveToken) } })
    if (!user)
      return {
        errors: [{ field: "user", message: "user is deleted" }],
      }
    req.session.userId = user.id
    const hashedPassword = await hash(newPassword)
    user.password = hashedPassword
    await user.save()
    await redis.del(key)
    return { user }
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
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
    const user = User.create({
      username: options.username,
      email: options.email,
      password: hashedPassword,
    })
    try {
      await user.save()
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
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({
      where: usernameOrEmail.includes("@")
        ? { email: usernameOrEmail }
        : { username: usernameOrEmail },
    })

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
