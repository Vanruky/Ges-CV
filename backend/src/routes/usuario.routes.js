const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/register', controller.register);
router.post('/login', controller.login);

// ruta protegida
router.get('/perfil', auth, (req, res) => {
    res.json({
        mensaje: 'Acceso autorizado',
        usuario: req.usuario
    });
});

module.exports = router;