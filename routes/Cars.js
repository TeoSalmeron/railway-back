const express = require('express')
const router = express.Router()
const upload = require("../middleware/upload")
const db = require("../config/db")
const date = require("../middleware/getCurrentDate")

router.get("/latest", async (req, res) => {
    try {
        const [latestCars] = await db.query("SELECT * FROM cars ORDER BY id DESC LIMIT 3;")

        if(!latestCars) {
            throw Error("Impossible de récupérer les dernières voitures")
        }
    
        return res.status(200).json(latestCars)
    } catch (error) {
        return res.status(error)
    }

})

router.post("/search", upload.none(), async (req, res) => {
    const { brand, year_from, year_to, min_price, max_price, min_kilometers, max_kilometers } = req.body;
    let sql = 'SELECT * FROM cars';
    let conditions = [];
    let params = [];

    if(!brand && !year_from && !year_to && !min_price && !max_price && !min_kilometers && !max_kilometers) {
        return res.status(400).send("Aucun critère n'a été envoyé")
    }

    if (brand) {
        conditions.push('brand = ?');
        params.push(brand);
    }

    if (year_from && year_to) {
        conditions.push('year BETWEEN ? AND ?');
        params.push(year_from, year_to);
    }

    if((year_from && !year_to) || (!year_from && year_to)){
        return res.status(400).send("Veuillez sélectionner une autre date")
    }

    if (min_price && max_price) {
        conditions.push('price BETWEEN ? AND ?');
        params.push(min_price, max_price);
    }

    if((min_price && !max_price) || (!min_price && max_price)){
        return res.status(400).send("Veuillez sélectionner un autre prix")
    }

    if (min_kilometers && max_kilometers) {
        conditions.push('kilometers BETWEEN ? AND ?');
        params.push(min_kilometers, max_kilometers);
    }

    if((min_kilometers && !max_kilometers) || (!min_kilometers && max_kilometers)){
        return res.status(400).send("Veuillez sélectionner deux valeurs pour les kilométrages")
    }

    if (conditions.length) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    try {
        const [results] = await db.query(sql, params);
        if (results.length === 0) {
            return res.status(200).json({results: false, message: "Aucun véhicule ne correspond à vos critères"})
        }
        return res.status(200).json({results: results});
    } catch (error) {
        return res.status(400).send(error.message);
    }
})

router.post("/create", upload.single("image"), async (req, res) => {
    const post = req.body

    try {
        if(post.title === "") {
            throw Error("Veuillez indiquer un titre pour l'annonce")
        }

        if(post.brand === "") {
            throw Error("Veuillez sélectionner une marque pour l'annonce")
        }

        if(post.year.length < 4) {
            throw Error("La date de mise en circulation est au mauvais format")
        }

        if(post.kilometers === "") {
            throw Error("Veuillez indiquer une date de mise en circulation")
        }

        if(post.price === "") {
            throw Error("Veuillez indiquer un prix pour l'annonce")
        }
        
        if(post.description === "") {
            throw Error("Veuillez indiquer une description pour l'annonce")
        }

        const [newCar] = await db.query("INSERT INTO cars(title,year,kilometers,brand,price,description,image,createdAt,garage_id) VALUES(?,?,?,?,?,?,?,?,?);",
        [post.title, post.year, post.kilometers, post.brand, post.price, post.description, req.file.filename, date(), 1])

        if(newCar.affectedRows === 0) {
            throw Error("Impossible de créer la nouvelle annonce, erreur serveur")
        }
        res.status(200).send("La nouvelle annonce a été créée !")
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

module.exports = router