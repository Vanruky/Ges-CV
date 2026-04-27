const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Probando conexión
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend funcionando' });
});

// Importación de Rutas
const usuarioRoutes = require('./routes/usuario.routes');
const candidatoRoutes = require('./routes/candidato.routes');
const postulacionRoutes = require('./routes/postulacion.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const adminRoutes = require('./routes/admin.routes');
const cvRoutes = require('./routes/cv.routes');

// Uso de Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/candidatos', candidatoRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;