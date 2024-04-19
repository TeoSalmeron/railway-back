const multer = require('multer');
const path = require("path")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Chemin où le fichier sera sauvegardé
    },
    filename: function (req, file, cb) {
        const fileExt = path.extname(file.originalname); // Extrait l'extension du fichier
        const fileName = file.fieldname + '-' + Date.now() + fileExt; // Construit le nouveau nom du fichier avec son extension
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
        return cb(new Error('Seuls les fichiers JPG, JPEG, PNG et WEBP sont autorisés !'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5242880 }, // Limite de taille de fichier
    fileFilter: fileFilter
});

module.exports = upload;
