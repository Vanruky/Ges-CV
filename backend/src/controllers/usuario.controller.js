const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const authService = require('../services/auth.service');

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

exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }

        const correoNormalizado = correo.toLowerCase().trim();

        const usuario = await Usuario.findOne({ where: { correo: correoNormalizado } });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        const esValido = await bcrypt.compare(password, usuario.password_hash);

        if (!esValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no definido en el archivo .env');
        }

        const token = jwt.sign(
            { id: usuario.id_usuario, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario.id_usuario,
                correo: usuario.correo,
                rol: usuario.rol
            }
        });

    } catch (error) {
        console.error('Error en Login:', error);
        res.status(500).json({ error: error.message });
    }
};