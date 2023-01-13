import express from "express"

import "./startup/config"
import dbConnectAndMigrate from "./startup/db"
import middleware from "./startup/middleware"

const app = express()
const port = process.env.PORT || 4000

dbConnectAndMigrate()
middleware(app)

app.listen(port, () => {
  console.log(`server is running at ${port}`)
})
