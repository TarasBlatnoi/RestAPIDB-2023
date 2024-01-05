'use strict'

require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./database')
const userRoutes = require('./routes/userRoutes')

app.use(express.json())
app.use('/users', userRoutes)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

const closeServer = async () => {
  console.log('\nStarting the process of closing the app...')
  try {
    await db.pool.end()
    await db.promisePool.end()
    await server.close(() => {
      console.log('App is closed :(')
      process.exit()
    })
  } catch (err) {
    console.error('Error while closing the app: ' + err.message)
    process.exit(1)
  }
}

process.on('SIGINT', closeServer)
process.on('SIGTERM', closeServer)
