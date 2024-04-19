const express = require('express')
const router = express.Router()
const bcryptjs = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const db = require("../config/db")
const date = require("../middleware/getCurrentDate")

router.post("/", async (req, res) => {

  const post = req.body

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  
// Check if e-mail is correct
  if(!emailRegex.test(post.email)) {
    return res.status(400).send("Le format de l'e-mail est incorrect")
  }

// Check if password is correct
  if(!passwordRegex.test(post.password)) {
    return res.status(400).send("Le mot de passe doit respecter les règles")
  }

// Check if passwords match
if(post.password !== post.confirmPassword) {
  return res.status(400).send("Les mots de passe ne correspondent pas")
}

// Look for user email in database

  let [user] = await db.query("SELECT * FROM users WHERE email = ?", [post.email])

  user = user[0]

  if(user) {
    return res.status(400).send("Un utilisateur possède déjà un compte enregistré avec cet e-mail")
  }

  
  // Generate crypted password and create user

  const uuid = uuidv4()

  bcryptjs.hash(post.password, 10, async (err, hash) => {
    if (err) {
      return res.status(400).send("Erreur lors du hashage du mot de passe")
    }
    try {
      const [user] = await db.query("INSERT INTO users(id,email,password,role,createdAt,garage_id) VALUES(?,?,?,?,?,?)", [uuid, post.email, hash, "employee", date(), 1])
      if(user.affectedRows === 0) {
        throw Error("Impossible de créer le nouvel employé")
      }
      return res.status(200).send("Le nouveau compte employé a bien été créé !")
    } catch (err) {
      return res.status(400).send(err.message)
    }
  })

})

module.exports = router