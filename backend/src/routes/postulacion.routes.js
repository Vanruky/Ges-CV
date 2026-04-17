const express = require('express');
const router = express.Router();

const controller = require('../controllers/postulacion.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/', auth, controller.crearPostulacion);
router.get('/mis-postulaciones', auth, controller.getMisPostulaciones);

module.exports = router;