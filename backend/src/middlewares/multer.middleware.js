const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const rutaCorrecta = path.join(__dirname, '../uploads/documentacion');
        cb(null, rutaCorrecta);
    },
    filename: (req, file, cb) => {
    const nombre = (req.body.nombre || 'CANDIDATO').replace(/\s+/g, '_');
    const apellido = (req.body.apellido || 'DESCONOCIDO').replace(/\s+/g, '_');
    
    // LIMPIEZA DEl nombre de CARGO
    const cargo = (req.body.cargo || 'CARGO')
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/\//g, '_') 
        .replace(/\s+/g, '_'); 

    const nombreFinal = `${nombre}_${apellido}_${cargo}_${Date.now()}${path.extname(file.originalname)}`.toUpperCase();
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