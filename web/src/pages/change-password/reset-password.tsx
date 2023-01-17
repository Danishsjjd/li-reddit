import Input from "@/components/Input"
import { useForgetPasswordMutation } from "@/generated/graphql"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { withUrqlClient } from "next-urql"
import { useForm } from "react-hook-form"

type FormData = {
  email: string
}

const ChangePassword = () => {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<FormData>()

  const [, sendResetPassMail] = useForgetPasswordMutation()

  const onSubmit = async (data: FormData) => {
    await sendResetPassMail(data)
  }

  return (
    <section className="pt-10 flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input<FormData>
          errors={errors}
          name="email"
          register={register}
          title="Email"
          type={"email"}
        />
        <button className={`btn mt-4 ${isSubmitting ? "loading" : ""}`}>
          submit
        </button>
      </form>
    </section>
  )
}

export default withUrqlClient(createUrqlClient)(ChangePassword)
