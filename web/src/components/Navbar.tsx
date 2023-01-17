import { useMeQuery, useLogoutMutation } from "@/generated/graphql"
import { ReactNode } from "react"
import Link from "next/link"
import { useIsServer } from "@/utils/isServer"

const Navbar = () => {
  const isServer = useIsServer()
  const [{ data, fetching }] = useMeQuery({
    pause: isServer,
  })
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()

  let body: null | ReactNode = null

  if (fetching) {
    // loading
    body = <span className="h-12">loading...</span>
  } else if (data?.me) {
    // found user
    body = (
      <>
        <span className="text-lg font-medium">{data.me.username}</span>
        <button
          className={`btn btn-link ${logoutFetching && "loading"}`}
          onClick={async () => {
            await logout({})
          }}
          disabled={fetching}
        >
          sign out
        </button>
      </>
    )
  } else {
    // user is not login
    body = (
      <>
        <Link href={"/login"} className="btn btn-link">
          Login
        </Link>
        <Link href={"/register"} className="btn btn-link">
          Register
        </Link>
      </>
    )
  }

  return (
    <header className="py-5 bg-orange-300">
      <nav className="max-w-7xl mx-auto flex justify-end gap-1 items-center">
        {body}
      </nav>
    </header>
  )
}

export default Navbar
