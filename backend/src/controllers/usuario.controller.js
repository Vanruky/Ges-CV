//esto hay que revisarlo porque ni idea si esta bn

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); // Importas Usuario desde el index
const authService = require('../services/auth.service'); 


exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }

        const correoNormalizado = correo.toLowerCase().trim();
        const usuario = await Usuario.obtenerPorCorreo(correoNormalizado);

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const esValido = await bcrypt.compare(password, usuario.password_hash);

        if (!esValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // CORRECCIÓN 2: Si en tu modelo usaste "AS id", aquí debe ser usuario.id
        // Si no usaste el alias en el modelo, mantén usuario.id_usuario
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id,
                correo: usuario.correo,
                rol: usuario.rol,
                nombre: usuario.nombre || usuario.usuario_nombre 
            }
        });

    } catch (error) {
        console.error('Error en Login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.register = async (req, res) => {
    try {
        const data = await authService.register(req.body);

        res.status(201).json({
            mensaje: 'Usuario creado con éxito',
            data
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};