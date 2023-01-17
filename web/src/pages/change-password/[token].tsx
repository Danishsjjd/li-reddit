import Input from "@/components/Input"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/router"
import { useResetPasswordMutation } from "@/generated/graphql"
import { withUrqlClient } from "next-urql"
import { createUrqlClient } from "@/utils/createUrqlClient"

type FormData = {
  newPassword: string
  confirmPassword: string
}

const ResetPassword = () => {
  const [tokenError, setTokenError] = useState<boolean | string>(false)
  const [, resetPassword] = useResetPasswordMutation()
  const router = useRouter()
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<FormData>()

  const { token } = router.query

  const onSubmit = async (data: FormData) => {
    if (data.confirmPassword !== data.newPassword)
      return setError("confirmPassword", {
        message: "confirm password is not match",
      })
    const response = await resetPassword({
      newPassword: data.newPassword,
      token: token as string,
    })

    if (response.data?.resetPassword.errors) {
      const error = response.data.resetPassword.errors
      error.map(({ field, message }) => {
        setError(field as keyof FormData, { message })
        if (field == "token") setTokenError(message)
      })
    } else if (response.data?.resetPassword.user) {
      router.push("/")
    }
  }

  return (
    <section className="pt-10 flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input<FormData>
          errors={errors}
          name="newPassword"
          register={register}
          title="Password"
          type={"password"}
        />
        <Input<FormData>
          errors={errors}
          name="confirmPassword"
          register={register}
          title="Confirm Password"
          type={"password"}
        />
        {tokenError && (
          <p className="text-red-500 font-medium text-lg mt-3">{tokenError}</p>
        )}
        <button className={`btn mt-4 ${isSubmitting ? "loading" : ""}`}>
          Change Password
        </button>
      </form>
    </section>
  )
}

export default withUrqlClient(createUrqlClient)(ResetPassword)
