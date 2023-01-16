import Input from "@/components/Input"
import { useRegisterMutation } from "@/generated/graphql"
import React from "react"
import { useForm } from "react-hook-form"

type FormData = {
  username: string
  password: string
}

const Register = () => {
  const [, registerUser] = useRegisterMutation()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    const response = await registerUser(data)
    if (response.data?.register.error) {
      response.data.register.error.map(({ field, message }) => {
        setError(field as keyof FormData, { message })
      })
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

export default Register
