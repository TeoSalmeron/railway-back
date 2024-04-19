const express = require('express')
const router = express.Router()
const db = require("../config/db")
const date = require("../middleware/getCurrentDate")

router.get("/verified", async (req, res) => {
    const [verifiedReviews] = await db.query("SELECT * FROM reviews WHERE verified = 1")
    return res.status(200).json(verifiedReviews)
})

router.get("/unverified", async (req, res) => {
    const [unverifiedReviews] = await db.query("SELECT * FROM reviews WHERE verified = 0")
    return res.status(200).json(unverifiedReviews)
})

router.post("/create", async (req, res) => {
    const post = req.body

    try {
    
        if(typeof(post.score) !== "number") {
            throw Error("La note est incorrecte")
        }

        if(post.comment === "") {
            throw Error("Le commentaire est vide")
        }

        const [newReview] = await db.query("INSERT INTO reviews(score,comment,verified,createdAt,garage_id) VALUES(?,?,?,?,?);", [post.score, post.comment, post.verified, date(), 1])

        if(newReview.affectedRows === 0) {
            throw Error("Impossible de créer votre nouvel avis")
        }

        if(post.verified == false) {
            return res.status(200).send("Votre avis est en attente de modération")
        } else {
            return res.status(200).send("Le nouvel avis a bien été créé!")
        }

    } catch (error) {
        return res.status(400).send(error.message)
    }

})

router.post("/manage", async (req, res) => {
    const post = req.body
    
    try {
        if(typeof(post.id) !== "number") {
            throw Error("L'identifiant de l'avis est incorrect")
        }

        if(post.action === "delete") {
            const [deleteReview] = await db.query("DELETE FROM reviews WHERE id = ?", [post.id])

            if(deleteReview.affectedRows === 0) {
                throw Error("L'avis avec cet ID n'a pas été trouvé")
            } 
                
            return res.status(200).send("Avis supprimé !")
            
        }

        if(post.action === "confirm") {
            const [updateReview] = await db.query("UPDATE reviews SET verified = 1 WHERE id = ?", [post.id])
            
            if(updateReview.affectedRows === 0) {
                throw Error("Erreur serveur, impossible de valider l'avis")
            }
            
            return res.status(200).send("Nouvel avis confirmé !")
        }
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

module.exports = router