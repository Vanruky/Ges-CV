const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const cvController = require('../controllers/cv.controller');


// Ruta para ver el PDF (el ID se pasa por la URL)
router.get('/ver-cv/:id_candidato', auth, cvController.verPDF);


module.exports = router;