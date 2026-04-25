const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidato.controller');
const auth = require('../middlewares/auth.middleware');

//aca los nombres del controlador deben coincidir con la ruta 
router.get('/perfil', auth, candidatoController.obtenerPerfil);
router.put('/perfil', auth, candidatoController.actualizarPerfil);

router.put('/perfil/:id', candidatoController.actualizarPerfil);

module.exports = router;