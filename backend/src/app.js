const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const usuarioRoutes = require('./routes/usuario.routes');
const candidatoRoutes = require('./routes/candidato.routes');

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/candidatos', candidatoRoutes);

module.exports = app;