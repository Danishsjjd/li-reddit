import Input from "@/components/Input"
import { useRegisterMutation } from "@/generated/graphql"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { withUrqlClient } from "next-urql"
import { useRouter } from "next/router"
import React from "react"
import { useForm } from "react-hook-form"

type FormData = {
  username: string
  password: string
  email: string
}

const Register = () => {
  const router = useRouter()
  const [, registerUser] = useRegisterMutation()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const response = await registerUser({ options: data })
    if (response.data?.register.errors) {
      response.data.register.errors.map(({ field, message }) => {
        setError(field as keyof FormData, { message })
      })
    } else if (response.data?.register.user) {
      router.push("/")
    }
  }

  return (
    <section className="pt-10 flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input<FormData>
          errors={errors}
          name="username"
          register={register}
          title="Username"
          type={"text"}
        />
        <Input<FormData>
          errors={errors}
          name="email"
          register={register}
          title="Email"
          type={"email"}
        />
        <Input<FormData>
          errors={errors}
          name="password"
          register={register}
          title="Password"
          type={"password"}
        />
        <button className={`btn mt-4 ${isSubmitting ? "loading" : ""}`}>
          Register
        </button>
      </form>
    </section>
  )
}

export default withUrqlClient(createUrqlClient)(Register)
