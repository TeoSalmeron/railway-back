const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.json({auth: false})
            } else {
                req.userId = decoded.id
                req.userEmail = decoded.email
                req.userRole = decoded.role
                next();
            }
        });
    } else {
        return res.json({auth: false})
    }
}

module.exports = auth