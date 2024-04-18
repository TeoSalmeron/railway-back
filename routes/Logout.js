const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {

    const token = req.cookies.token

    if(token) {
        res.clearCookie("token", {
            path: "/",
            sameSite: "none"
        })
        return res.status(200).json({logout: true})
    } else {
        return res.status(200).json({logout: false})
    }

})

module.exports = router