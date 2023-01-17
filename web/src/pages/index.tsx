import Navbar from "@/components/Navbar"
import { usePostsQuery } from "@/generated/graphql"
import { createUrqlClient } from "@/utils/createUrqlClient"
import { withUrqlClient } from "next-urql"
import React from "react"

const Home = () => {
  const [data] = usePostsQuery()
  return (
    <>
      <Navbar />
      <h1>Hello World</h1>
      <br />
      {!data
        ? null
        : data.data?.posts.map((post) => <div key={post.id}>{post.title}</div>)}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home)
