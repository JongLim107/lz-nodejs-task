require('./db/mongoose') // init db & setup the connection

const express = require('express')
const UserRouter = require('./routers/user')
const TaskRouter = require('./routers/task')

const app = express()

app.use(express.json()) // This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
app.use(UserRouter, TaskRouter)

module.exports = app
