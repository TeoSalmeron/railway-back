const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")
const db = require("../config/db")

router.post("/", async (req, res) => {

    const post = req.body

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
    // See if e-mail is correct
    if(!emailRegex.test(post.email)) {
        return res.status(400).send("Le format de l'e-mail est incorrect")
    }

    // Check if user exists in database
    let [user] = await db.query("SELECT * FROM users WHERE email = ?", [post.email])

    user = user[0]

    if(!user) {
        return res.status(400).send("Cet e-mail n'est pas enregistré chez nous")
    }

    // Check if passwords match
    bcryptjs.compare(post.password, user.password, (err, match) => {
        if(err) {
            throw err
        } else if (!match) {
            return res.status(401).send("Le mot de passe est incorrect")
        } else {

            // Generate token
            const jwtToken = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET
            )

            // Send cookie with token
            res.cookie('token', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'strict', 
                maxAge: 3600000
            })

            // Success
            return res.status(200).json({
                token: jwtToken,
                user: user
            })

        }
    })
})

module.exports = router