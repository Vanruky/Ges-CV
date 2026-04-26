const express = require('express');
const router = express.Router();
const candidatoController = require('../controllers/candidato.controller');
const postulacionController = require('../controllers/postulacion.controller');
const upload = require('../middlewares/multer.middleware');
const auth = require('../middlewares/auth.middleware');

/*estas rutas necesitan el  token , todo lo que 
esta abajo es privado si hay algo publico aca
se tiene que dejar antes de esta linea de autenticacion*/
router.use(auth);


//aca los nombres del controlador deben coincidir con la ruta 
router.get('/perfil', auth, candidatoController.obtenerPerfil);
router.put('/perfil', auth, candidatoController.actualizarPerfil);

//como postular y traer la postulacion
router.post('/postular', upload.single('archivo'), postulacionController.crearPostulacion);
router.get('/mis-postulaciones', postulacionController.getMisPostulaciones);

module.exports = router;