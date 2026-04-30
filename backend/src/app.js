require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); //import conexión

const app = express();

app.use(cors());
app.use(express.json());

// --- PRUEBA DE CONEXIÓN A BASE DE DATOS ---
async function verificarDB() {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('✅ Conexión a MySQL (ges_cv_db) exitosa.');
    } catch (error) {
        console.error('❌ Error conectando a MySQL:', error.message);
    }
}
verificarDB();

//prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend funcionando y conectado' });
});

//rutas
const usuarioRoutes = require('./routes/usuario.routes');
const candidatoRoutes = require('./routes/candidato.routes');
const postulacionRoutes = require('./routes/postulacion.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const adminRoutes = require('./routes/admin.routes');
const cvRoutes = require('./routes/cv.routes');

//uso de rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/candidatos', candidatoRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;