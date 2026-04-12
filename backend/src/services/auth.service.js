const bcrypt = require('bcrypt');
const { Usuario, Candidato } = require('../models');

exports.register = async (data) => {
    const t = await Usuario.sequelize.transaction();

    try {
        const {
            correo,
            password,
            nombre,
            apellido_paterno,
            apellido_materno,
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

        const existe = await Usuario.findOne({
            where: { correo: correoNormalizado }
        });

        if (existe) {
            throw new Error('El correo ya está registrado');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const usuario = await Usuario.create({
            correo: correoNormalizado,
            password_hash: passwordHash,
            rol: 'CANDIDATO'
        }, { transaction: t });

        const candidato = await Candidato.create({
            id_usuario: usuario.id_usuario,
            nombre,
            apellido_paterno,
            apellido_materno,
            tipo_identificacion,
            numero_identificacion
        }, { transaction: t });

        await t.commit();

        return { usuario, candidato };

    } catch (error) {
        await t.rollback();
        throw error;
    }
};