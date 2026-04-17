const { Op } = require('sequelize');
const { Postulacion } = require('../models');
const obtenerDatosCandidato = require('../utils/obtenerRutYId');

/*Con SQL ON: cambiar: const USE_MOCK = false;    eliminar: postulacionesMock    se activan automáticamente las consultas Sequelize*/

const USE_MOCK = true;

//postulacionesMock
let postulacionesMock = [
    {
        id_postulacion: 1,
        id_candidato: 1,
        rut: "12.345.678-9",
        nombre: "Miren",
        apellido_paterno: "Romero",
        apellido_materno: "Test",
        estamento: "Administrativo",
        cargo: "Psicologo",
        archivo: "cv1.pdf",
        fecha_postulacion: new Date(),
        cuestionario_realizado: false,
        fecha_cuestionario: null
    }
];

exports.crearPostulacion = async (req, res) => {
    try {
        const { id_candidato, rut } = await obtenerDatosCandidato(req);

        const {
            nombre,
            apellido_paterno,
            apellido_materno,
            estamento,
            cargo
        } = req.body;

        const hace6Meses = new Date();
        hace6Meses.setMonth(hace6Meses.getMonth() - 6);

        if (USE_MOCK) {
            const existe = postulacionesMock.find(p =>
                p.rut === rut &&
                p.cargo === cargo &&
                new Date(p.fecha_postulacion) >= hace6Meses
            );

            if (existe) {
                return res.status(400).json({
                    mensaje: 'Ya postulaste a este cargo en los últimos 6 meses'
                });
            }

            const nueva = {
                id_postulacion: postulacionesMock.length + 1,
                id_candidato,
                rut,
                nombre,
                apellido_paterno,
                apellido_materno,
                estamento,
                cargo,
                archivo: "cv_mock.pdf",
                fecha_postulacion: new Date(),
                cuestionario_realizado: false,
                fecha_cuestionario: null
            };

            postulacionesMock.push(nueva);

            return res.status(201).json(nueva);
        }

        const existe = await Postulacion.findOne({
            where: {
                rut,
                cargo,
                fecha_postulacion: {
                    [Op.gte]: hace6Meses
                }
            }
        });

        if (existe) {
            return res.status(400).json({
                mensaje: 'Ya postulaste a este cargo en los últimos 6 meses'
            });
        }

        const nueva = await Postulacion.create({
            id_candidato,
            rut,
            nombre,
            apellido_paterno,
            apellido_materno,
            estamento,
            cargo,
            archivo: "cv.pdf"
        });

        res.status(201).json(nueva);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMisPostulaciones = async (req, res) => {
    try {
        const { rut } = await obtenerDatosCandidato(req);

        if (USE_MOCK) {
            const data = postulacionesMock.filter(p => p.rut === rut);
            return res.json(data);
        }

        const data = await Postulacion.findAll({
            where: { rut },
            order: [['fecha_postulacion', 'DESC']]
        });

        res.json(data);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};