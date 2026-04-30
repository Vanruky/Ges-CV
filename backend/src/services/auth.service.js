const bcrypt = require('bcrypt');
const { Usuario, Candidato } = require('../models');

exports.register = async (data) => {
    const {
        correo,
        password,
        nombre,
        apellido_paterno,
        apellido_materno,
        celular,
        tipo_identificacion,
        numero_identificacion
    } = data;

    if (!correo || !password) {
        throw new Error('Faltan datos');
    }

    const correoNormalizado = correo.toLowerCase().trim();
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correoNormalizado)) {
        throw new Error('Correo inválido');
    }

    if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    const existeUsuario = await Usuario.obtenerPorCorreo(correoNormalizado);
    if (existeUsuario) {
        throw new Error('El correo ya está registrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const idUsuarioCreado = await Usuario.crear(correoNormalizado, passwordHash, 'CANDIDATO');

    const idCandidatoCreado = await Candidato.crearPerfil(idUsuarioCreado, {
        tipo_identificacion,
        numero_identificacion,
        nombre,
        apellido_paterno,
        apellido_materno,
        celular
    });

    return {
        usuario: {
            id: idUsuarioCreado,
            correo: correoNormalizado,
            rol: 'CANDIDATO'
        },
        candidato: {
            id_candidato: idCandidatoCreado
        }
    };
};