const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/reportes_admin';
        // Crea la carpeta si no aparece 
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Para reportes usamos el tipo de reporte y un timestamp 
        const tipo = req.body.tipo_reporte || 'REPORTE';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${tipo.toUpperCase()}_${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Filtro de archivos : permite mas formatos como pdf, excel , png , etc. 
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
        'application/vnd.ms-excel',                                         
        'image/png',
        'image/jpeg'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Formato no permitido. Use PDF, Excel o Imagen (JPG/PNG).'), false);
    }
};

const adminUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // acá el limite del admin es de 10 mb 
});

module.exports = adminUpload;