import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { Provider, createClient, dedupExchange, fetchExchange } from "urql"
import { cacheExchange } from "@urql/exchange-graphcache"
import { devtoolsExchange } from "@urql/devtools"
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "@/generated/graphql"

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          login: (results: LoginMutation, _, cache) => {
            cache.updateQuery<MeQuery>({ query: MeDocument }, (query) => {
              if (results.login.errors) return query
              return {
                me: results.login.user,
              }
            })
          },
          register: (results: RegisterMutation, _, cache) => {
            cache.updateQuery<MeQuery>({ query: MeDocument }, (query) => {
              if (results.register.errors) return query
              return {
                me: results.register.user,
              }
            })
          },
        },
      },
    }),
    fetchExchange,
  ],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={client}>
      <Component {...pageProps} />
    </Provider>
  )
}
