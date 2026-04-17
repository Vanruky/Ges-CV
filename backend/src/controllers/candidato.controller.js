const { Candidato } = require('../models');

const USE_MOCK = true;
/*CON SQL ON: borrar*/
let candidatoMock = {
    id_candidato: 1,
    id_usuario: 1,
    numero_identificacion: "12.345.678-9",
    rut_editado: 0,
    nombre: "Miren",
    apellido_paterno: "Romero",
    apellido_materno: "Test",
    correo: "test@test.com",
    celular: "123456789"
};

exports.getPerfil = async (req, res) => {
    try {

        if (USE_MOCK) {
            return res.json({
                ...candidatoMock,
                nombre_completo: `${candidatoMock.nombre} ${candidatoMock.apellido_paterno} ${candidatoMock.apellido_materno}`
            });
        }

        const candidato = await Candidato.findOne({
            where: { id_usuario: req.usuario.id }
        });

        res.json({
            ...candidato.dataValues,
            nombre_completo: `${candidato.nombre} ${candidato.apellido_paterno} ${candidato.apellido_materno}`
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePerfil = async (req, res) => {
    try {
        const {
            numero_identificacion,
            nombre,
            apellido_paterno,
            apellido_materno,
            correo,
            celular
        } = req.body;

        if (!nombre || !apellido_paterno) {
            return res.status(400).json({
                mensaje: "Nombre y apellido son obligatorios"
            });
        }

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (correo && !regexCorreo.test(correo)) {
            return res.status(400).json({
                mensaje: "Correo inválido"
            });
        }

        if (USE_MOCK) {
            //RUT solo es editable una vez, en caso de error de typeo
            if (
                numero_identificacion &&
                numero_identificacion !== candidatoMock.numero_identificacion
            ) {
                if (candidatoMock.rut_editado === 1) {
                    return res.status(400).json({
                        mensaje: "El RUT ya fue modificado anteriormente"
                    });
                }

                candidatoMock.numero_identificacion = numero_identificacion;
                candidatoMock.rut_editado = 1;
            }

            candidatoMock.nombre = nombre;
            candidatoMock.apellido_paterno = apellido_paterno;
            candidatoMock.apellido_materno = apellido_materno;
            candidatoMock.correo = correo;
            candidatoMock.celular = celular;

            return res.json({
                mensaje: "Perfil actualizado (mock)",
                data: candidatoMock
            });
        }

        //SQL
        const candidato = await Candidato.findOne({
            where: { id_usuario: req.usuario.id }
        });

        if (
            numero_identificacion &&
            numero_identificacion !== candidato.numero_identificacion
        ) {
            if (candidato.rut_editado === 1) {
                return res.status(400).json({
                    mensaje: "El RUT ya fue modificado anteriormente"
                });
            }

            candidato.numero_identificacion = numero_identificacion;
            candidato.rut_editado = 1;
        }

        candidato.nombre = nombre;
        candidato.apellido_paterno = apellido_paterno;
        candidato.apellido_materno = apellido_materno;
        candidato.correo = correo;
        candidato.celular = celular;

        await candidato.save();

        res.json({
            mensaje: "Perfil actualizado",
            data: candidato
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};