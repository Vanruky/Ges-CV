const express = require('express');
const router = express.Router();

const controller = require('../controllers/candidato.controller');
const auth = require('../middlewares/auth.middleware');

router.get('/perfil', auth, controller.getPerfil);
router.put('/perfil', auth, controller.updatePerfil);

router.put('/perfil/:id', candidatoController.actualizarPerfil);

module.exports = router;