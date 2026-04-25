const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postulacionController = require('../controllers/postulacion.controller')
const auth = require('../middlewares/auth.middleware');


//se configura el multer para guardar el cv con la nueva postulacion
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/documentacion'); 
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//las rutas
router.post('/', auth, upload.single('archivo'), postulacionController.crearPostulacion);

//visualizar

router.get('/mis-postulaciones', auth, postulacionController.getMisPostulaciones);

module.exports = router;