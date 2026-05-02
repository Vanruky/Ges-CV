const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminUpload = require('../middlewares/admin.middleware');
const authMiddleware = require('../middlewares/auth.middleware');


// HISTORIAL
router.get('/historial', adminController.getHistorial);
router.get('/historial/export/excel', adminController.exportExcelHistorial);
router.get('/historial/export/pdf', adminController.exportPDFHistorial);
router.post('/delete-postulaciones', adminController.deletePostulaciones);

// REPORTES
router.get('/reportes', adminController.getReportes);
router.post('/reportes', authMiddleware, adminUpload.single('archivo'), adminController.createReporte);
router.get('/reportes/export/excel', adminController.exportExcelReportes);
router.get('/reportes/export/pdf', adminController.exportPDFReportes);

module.exports = router;