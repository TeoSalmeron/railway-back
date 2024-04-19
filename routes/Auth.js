const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth")

router.get("/", auth, async (req, res) => {
    res.json({
        auth: true,
        role: req.userRole,
        email: req.userEmail
    })
})

module.exports = router