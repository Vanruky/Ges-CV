const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const admin = require('../middlewares/admin.middleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo PDF o imágenes'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

router.get('/home', adminController.getDashboard);

// POSTULACIONES (HISTORIAL)
router.get('/historial', adminController.getHistorial);
router.get('/historial/export/excel', adminController.exportExcelHistorial);
router.get('/historial/export/pdf', adminController.exportPDFHistorial);
router.post('/delete-postulaciones', adminController.deletePostulaciones);

// REPORTES
router.get('/reportes', adminController.getReportes);
router.post('/reportes', upload.single('archivo'), adminController.createReporte);
router.get('/reportes/export/excel', adminController.exportExcelReportes);
router.get('/reportes/export/pdf', adminController.exportPDFReportes);

module.exports = router;