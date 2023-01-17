import Input from "@/components/Input"
import { useLoginMutation } from "@/generated/graphql"
import React from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "@/utils/createUrqlClient"

type FormData = {
  usernameOrEmail: string
  password: string
}

const Login = () => {
  const router = useRouter()
  const [, loginUser] = useLoginMutation()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const response = await loginUser({
      password: data.password,
      usernameOrEmail: data.usernameOrEmail,
    })
    if (response.data?.login.errors) {
      response.data.login.errors.map(({ field, message }) => {
        setError(field as keyof FormData, { message })
      })
    } else if (response.data?.login.user) {
      router.push("/")
    }
  }

  return (
    <section className="pt-10 flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input<FormData>
          errors={errors}
          name="usernameOrEmail"
          register={register}
          title="username or email"
          type={"text"}
        />
        <Input<FormData>
          errors={errors}
          name="password"
          register={register}
          title="Password"
          type={"password"}
        />
        <button className={`btn mt-4 ${isSubmitting ? "loading" : ""}`}>
          Login
        </button>
      </form>
    </section>
  )
}

export default withUrqlClient(createUrqlClient)(Login)
