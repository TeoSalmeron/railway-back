require("dotenv").config()
const mysql = require("mysql2/promise")

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`
const db = mysql.createPool(urlDB)

module.exports = db

