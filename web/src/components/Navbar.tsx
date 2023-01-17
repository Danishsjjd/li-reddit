import { useMeQuery } from "@/generated/graphql"
import { ReactNode } from "react"
import Link from "next/link"

const Navbar = () => {
  const [{ data, fetching }] = useMeQuery()

  let body: null | ReactNode = null

  if (fetching) {
    // loading
    body = "loading..."
  } else if (data?.me) {
    // found user
    body = (
      <>
        <span className="text-lg font-medium">{data.me.username}</span>
        <button className="btn btn-link">sign out</button>
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
    <header className="py-7 bg-orange-400">
      <nav className="max-w-7xl mx-auto flex justify-end gap-1 items-center">
        {body}
      </nav>
    </header>
  )
}

export default Navbar
