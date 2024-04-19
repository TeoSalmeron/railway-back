require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const path = require("path")
const port = process.env.PORT || 3001

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.ORIGIN,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}))
app.use("/images", cors(), express.static(path.join(__dirname, "uploads/")))

// ROUTES
const loginRouter = require("./routes/Login")
app.use("/login", loginRouter)

const logOutRouter = require("./routes/Logout")
app.use("/logout", logOutRouter)

const authRouter = require("./routes/Auth")
app.use("/auth", authRouter)

const createEmployeeRouter = require("./routes/CreateEmployee")
app.use("/create-employee", createEmployeeRouter)

const schedulesRouter = require("./routes/Schedules")
app.use("/schedules", schedulesRouter)

const reviewsRouter = require("./routes/Reviews")
app.use("/reviews", reviewsRouter)

const carsRouter = require("./routes/Cars")
app.use("/cars", carsRouter)

app.listen(port, () => {
    console.log("Server listening on port : " + port)
})