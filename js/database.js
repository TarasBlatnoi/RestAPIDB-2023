'use strict'

require('dotenv').config()
const promiseMysql = require('mysql2/promise')

const access = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
}

const promisePool = promiseMysql.createPool(access)

const promiseConnectionFactory = () => promiseMysql.createConnection(access)

module.exports = {
  promisePool,
  promiseConnectionFactory,
}
