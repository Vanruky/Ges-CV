const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importación de Rutas
const usuarioRoutes = require('./routes/usuario.routes');
const candidatoRoutes = require('./routes/candidato.routes');
const postulacionRoutes = require('./routes/postulacion.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

// Uso de Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/candidatos', candidatoRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/dashboard', dashboardRoutes);

module.exports = app;