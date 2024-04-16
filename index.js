require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 3001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}))

// ROUTES
const loginRouter = require("./routes/Login")
app.use("/login", loginRouter)

const authRouter = require("./routes/Auth")
app.use("/auth", authRouter)

app.listen(port, () => {
    console.log("Server listening on port : " + port)
})