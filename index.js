require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const db = require("./config/db")
const port = process.env.PORT || 3001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    withCredentials: true
}))

app.get("/", async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM users")
        return res.status(200).json(users)
    } catch (error) {
        res.send(error.message)
    }
})

app.listen(port, () => {
    console.log("Server listening on port : " + port)
})