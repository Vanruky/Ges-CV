const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const usuarioController = require('../controllers/usuario.controller');


router.post('/register', usuarioController.register);
router.post('/login', usuarioController.login);

// ruta protegida
router.get('/perfil', auth, (req, res) => {
    res.json({
        mensaje: 'Acceso autorizado',
        usuario: req.usuario
    });
});

module.exports = router;