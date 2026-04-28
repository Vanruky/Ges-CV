const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

// se crea otro middleware
const adminUpload = require('../middlewares/admin.middleware');

// rutas
router.get('/historial', adminController.getHistorial);
router.post('/delete-postulaciones', adminController.deletePostulaciones);

// reportes
router.get('/reportes', adminController.getReportes);
router.post('/reportes', adminUpload.single('archivo'), adminController.createReporte);

// Exportaciones
router.get('/historial/export/excel', adminController.exportExcelHistorial);
router.get('/reportes/export/excel', adminController.exportExcelReportes);

module.exports = router;