const express = require('express');
const router = express.Router();
const db = require("../config/db")

router.get('/', async (req, res) => {
    try {
        const [schedules] = await db.query("SELECT * FROM schedules")
        res.status(200).json({schedules: schedules})
    } catch (error) {
        res.status(400).json({error: error})
    }
})

router.patch("/update/opening", async (req, res) => {
    const schedules = req.body
    
    try {
        if(!schedules) {
            throw Error("Les données du formulaire n'ont pas été reçues")
        }
        // Check if datas are correct
        schedules.map((schedule) => {
            if(schedule.open_time === "") {
                throw Error("Le formulaire est incomplet, veuillez le compléter")
            }
            const timeRegex = /^[0-9]{2}:[0-9]{2}$/
            if(!timeRegex.test(schedule.open_time)) {
                throw Error("Le formulaire contient des données incorrectes")
            }
        })

        // Update opening schedule
        for (const s of schedules) {
            const [schedule] = await db.query("UPDATE schedules SET open_time = ? WHERE day = ?", [s.open_time, s.day])
            if(schedule.affectedRows === 0) {
                throw Error("Impossible de mettre à jour les horaires d'ouverture")
            }
        }
        
        res.status(200).send("Les horaires d'ouverture ont été mises à jour")

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/update/closing", async (req, res) => {
    const schedules = req.body
    
    try {
        if(!schedules) {
            throw Error("Les données du formulaire n'ont pas été reçues")
        }
        // Check if datas are correct
        schedules.map((schedule) => {
            if(schedule.close_time === "") {
                throw Error("Le formulaire est incomplet, veuillez le compléter")
            }
            const timeRegex = /^[0-9]{2}:[0-9]{2}$/
            if(!timeRegex.test(schedule.close_time)) {
                throw Error("Le formulaire contient des données incorrectes")
            }
        })

        // Update closing schedule
        for (const s of schedules) {
            const [schedule] = await db.query("UPDATE schedules SET close_time = ? WHERE day = ?", [s.close_time, s.day])
            if(schedule.affectedRows === 0) {
                throw Error("Impossible de mettre à jour les horaires de fermeture")
            }
        }
        res.status(200).send("Les horaires de fermeture ont été mises à jour")

    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.patch("/update/days-off", async (req, res) => {
    const schedule = req.body

    try {
        if(!schedule) {
            throw Error("Les données du formulaire n'ont pas été reçues")
        }

        if(typeof(schedule.is_opened) !== "number") {
            throw Error("Les données du formulaire sont incorrectes")
        }
        
        const [update] = await db.query("UPDATE schedules SET is_opened = ? WHERE day = ?", [schedule.is_opened, schedule.day])

        if(update.affectedRows === 0) {
            throw Error("Impossible de mettre à jour le planning")
        }

        res.status(200).send("Le planning a été mis à jour !")

    } catch (error) {
        res.status(400).send(error.message)

    }
})

module.exports = router