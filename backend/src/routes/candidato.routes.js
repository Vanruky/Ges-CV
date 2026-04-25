const express = require('express');
const router = express.Router();

const candidatoController = require('../controllers/candidato.controller');
const auth = require('../middlewares/auth.middleware');

//aca los nombres del controlador deben coincidir con la ruta 
router.get('/perfil', auth, controller.getPerfil);
router.put('/perfil', auth, controller.updatePerfil);

router.put('/perfil/:id', candidatoController.actualizarPerfil);

module.exports = router;