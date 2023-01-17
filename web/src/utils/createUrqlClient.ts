import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
} from "@/generated/graphql"
import { devtoolsExchange } from "@urql/devtools"
import { dedupExchange, fetchExchange } from "urql"
import { cacheExchange } from "@urql/exchange-graphcache"

export const createUrqlClient = (ssrExchange: any) => ({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    credentials: "include" as const,
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
          logout: (results: LogoutMutation, _, cache) => {
            cache.updateQuery<MeQuery>({ query: MeDocument }, (query) => {
              if (!results.logout) return query
              return {
                me: null,
              }
            })
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
})
