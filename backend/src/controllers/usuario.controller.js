//esto hay que revisarlo porque ni idea si esta bn

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models'); // Importas Usuario desde el index
const authService = require('../services/auth.service');


exports.login = async (req, res) => {
    try {
        const { correo, password } = req.body;

        console.log('Login request recibido:', { correo, password: password ? '****' : null });

        if (!correo || !password) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }

        const correoNormalizado = correo.toLowerCase().trim();
        const usuario = await Usuario.obtenerPorCorreo(correoNormalizado);

        console.log('Usuario encontrado en DB:', usuario ? { id: usuario.id, correo: usuario.correo, rol: usuario.rol } : null);

        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        let esValido = false;
        const passwordHash = usuario.password_hash || '';
        const isHashed = typeof passwordHash === 'string' && passwordHash.startsWith('$2');

        if (isHashed) {
            esValido = await bcrypt.compare(password, passwordHash);
            console.log('Resultado bcrypt.compare:', esValido);
        } else {
            esValido = password === passwordHash;
            console.log('Password plano comparado directamente:', esValido);
            if (esValido) {
                const nuevoHash = await bcrypt.hash(password, 10);
                await Usuario.actualizarContrasenia(usuario.id, nuevoHash);
                console.log('Password en texto plano re-hasheado para usuario:', usuario.id);
            }
        }

        if (!esValido) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        // CORRECCIÓN 2: Si en tu modelo usaste "AS id", aquí debe ser usuario.id
        // Si no usaste el alias en el modelo, mantén usuario.id_usuario
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET no está configurado en las variables de entorno.');
            return res.status(500).json({ error: 'Configuración de servidor incompleta' });
        }

        const token = jwt.sign(
            { id_usuario: usuario.id, rol: usuario.rol, correo: usuario.correo },
            jwtSecret,
            { expiresIn: '2h' }
        );

        res.json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id_usuario: usuario.id,
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