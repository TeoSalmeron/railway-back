const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {

    res.clearCookie("token", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "none"
    })
    return res.status(200).json({logout: true})


})

module.exports = router