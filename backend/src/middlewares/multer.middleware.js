const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/documentacion');
    },
    filename: (req, file, cb) => {
        //datos del body que enviará el Front-end
        const nombre = req.body.nombre || 'SIN_NOMBRE';
        const apellido = req.body.apellido || 'SIN_APELLIDO';
        const cargo = req.body.cargo || 'SIN_CARGO';
        
        // creamos el nombre apellido y cargo 
        const nombreBase = `${nombre}_${apellido}_${cargo}`.replace(/\s+/g, '_').toUpperCase();
        
        // timestamp por si postula denuevo no se borre la info
        const nombreFinal = `${nombreBase}_${Date.now()}${path.extname(file.originalname)}`;
        
        cb(null, nombreFinal);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PDF'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;