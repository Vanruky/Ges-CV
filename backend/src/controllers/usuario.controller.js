const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// REGISTRO
exports.register = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // 1. Validar que existan los datos
        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }

        const correoNormalizado = correo.toLowerCase().trim();

        // 2. Validar formato de correo
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correoNormalizado)) {
            return res.status(400).json({ mensaje: 'Correo inválido' });
        }

        // 3. Validar largo de contraseña
        if (password.length < 8) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres' });
        }

        // 4. Verificar si el usuario ya existe en la BD REAL
        const existe = await Usuario.findOne({ where: { correo: correoNormalizado } });
        if (existe) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        // 5. Hashear contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // 6. Guardar en la BD Real (MySQL)
        await Usuario.create({
            correo: correoNormalizado,
            password_hash: passwordHash,
            rol: 'CANDIDATO' // Rol asignado automáticamente
        });

        res.status(201).json({ mensaje: 'Usuario registrado con éxito' });

    } catch (error) {
        console.error('Error en Register:', error);
        res.status(500).json({ error: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }

        const correoNormalizado = correo.toLowerCase().trim();

        // 1. Buscar usuario en la BD Real
        const usuario = await Usuario.findOne({ where: { correo: correoNormalizado } });

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // 2. Comparar password con el hash de la BD
        const esValido = await bcrypt.compare(password, usuario.password_hash);
        if (!esValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // 3. Generar token
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