const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const postulacionController = require('../controllers/postulacion.controller');
const auth = require('../middlewares/auth.middleware');

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/documentacion'); },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/opciones', postulacionController.obtenerOpciones);

router.use(auth);
router.post('/', upload.single('cv'), postulacionController.crearPostulacion);
router.get('/mis-postulaciones', postulacionController.getMisPostulaciones);

module.exports = router;