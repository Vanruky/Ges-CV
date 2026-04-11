const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// simulación sin bd
let usuarios = [];

// REGISTER
exports.register = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // validar 
        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }

        const correoNormalizado = correo.toLowerCase().trim();

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexCorreo.test(correoNormalizado)) {
            return res.status(400).json({ mensaje: 'Correo inválido' });
        }

        if (password.length < 8) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 8 caracteres' });
        }

        // asignar rol automáticamente
        const rol = 'CANDIDATO';

        const existe = usuarios.find(u => u.correo === correoNormalizado);

        if (existe) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        // hash password
        const passwordHash = await bcrypt.hash(password, 10);

        const nuevoUsuario = {
            id: usuarios.length + 1,
            correo: correoNormalizado,
            password_hash: passwordHash,
            rol,
            createdAt: new Date()
        };

        usuarios.push(nuevoUsuario);

        res.status(201).json({ mensaje: 'Usuario registrado' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // validar
        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }

        const correoNormalizado = correo.toLowerCase().trim();

        const usuario = usuarios.find(u => u.correo === correoNormalizado);

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // comparar password
        if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // generar token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET no definido');
        }

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
                rol: usuario.rol
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};