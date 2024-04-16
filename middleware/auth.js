const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(400).send("Erreur lors de la récupération du token")
            } else {
                req.userId = decoded.id
                req.userEmail = decoded.email
                req.userRole = decoded.role
                next();
            }
        });
    } else {
        return res.status(401).send("Un token est nécessaire pour vérifier l'authentification")
    }
}

module.exports = auth