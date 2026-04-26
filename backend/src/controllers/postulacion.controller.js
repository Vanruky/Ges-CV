const { Postulacion , Curriculum} = require('../models'); 
const obtenerDatosCandidato = require('../utils/obtenerDatosCandidato');
const fs = require('fs');
const path = require('path'); 


//nueva postulación
exports.crearPostulacion = async (req, res) => {
    try {
        //id_candidato desde el token
        const datos = await obtenerDatosCandidato(req);

        if (!datos || !datos.id_candidato) {
        return res.status(403).json({ mensaje: "Perfil de candidato no encontrado" });
        }
        const id_candidato = datos.id_candidato;
        const { id_cargo, id_estamento } = req.body;
        //los campos obligatorios
        if (!id_cargo || !id_estamento) {
            return res.status(400).json({ mensaje: "Cargo y Estamento son obligatorios" });
        }

        //Verificar duplicados 
        const existe = await Postulacion.verificarDuplicado(id_candidato, id_cargo);
        
        if (existe) {
            return res.status(400).json({ 
                mensaje: 'Ya posees una postulación activa para este cargo.' 
            });
        }

        // Crear nueva postulacion
        const id_nueva_postulacion = await Postulacion.crearPostulacion(id_candidato, { 
            id_cargo, 
            id_estamento 
        });

        // si se sube documentacion se registra 
        if (req.file) {
            await Curriculum.subir(
                id_candidato,
                req.file.originalname, 
                req.file.filename    
            );
        }

        res.status(201).json({
            ok: true,
            mensaje: "Postulación realizada con éxito",
            id_postulacion: id_nueva_postulacion
        });

    } catch (error) {
        console.error("Error al postular:", error);
        res.status(500).json({ error: "Error interno al procesar la postulación" });
    }
};

// Historial de las postulaciones
exports.getMisPostulaciones = async (req, res) => {
    try {
        const { id_candidato } = await obtenerDatosCandidato(req);
        
        // funcion que trae los nombres de cargos y estados
        const data = await Postulacion.obtenerPorCandidato(id_candidato);

        res.json(data);
    } catch (error) {
        console.error("Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener tus postulaciones" });
    }
};



/* logica con sequelize
const { Postulacion, Candidato } = require('../models');
const obtenerDatosCandidato = require('../utils/obtenerRutYId');

const USE_MOCK = true;
let postulacionesMock = [
    {
        id_postulacion: 1,
        id_candidato: 1,
        rut: "12.345.678-9",
        nombre: "Miren",
        apellido_paterno: "Romero",
        apellido_materno: "Test",
        estamento: "Administrativo",
        cargo: "Psicólogo",
        archivo: "cv1.pdf",
        fecha_postulacion: new Date('2024-01-01'),
        cuestionario_realizado: false
    }
];

exports.crearPostulacion = async (req, res) => {
    try {
        const { id_candidato } = await obtenerDatosCandidato(req);
        const { estamento, cargo } = req.body;
        const hace6Meses = new Date();
        hace6Meses.setMonth(hace6Meses.getMonth() - 6);

        if (USE_MOCK) {
            const existe = postulacionesMock.find(p => 
                p.id_candidato === id_candidato && p.cargo === cargo && new Date(p.fecha_postulacion) >= hace6Meses
            );
            if (existe) return res.status(400).json({ mensaje: 'Ya postulaste a este cargo en los últimos 6 meses' });

            const nueva = {
                id_postulacion: postulacionesMock.length + 1,
                id_candidato,
                estamento,
                cargo,
                fecha_postulacion: new Date(),
                cuestionario_realizado: false
            };
            postulacionesMock.push(nueva);
            return res.status(201).json(nueva);
        }

        const perfil = await Candidato.findByPk(id_candidato);
        const existeSQL = await Postulacion.findOne({
            where: { id_candidato, id_cargo: cargo, fecha_postulacion: { [Op.gte]: hace6Meses } }
        });

        if (existeSQL) return res.status(400).json({ mensaje: 'Ya postulaste a este cargo en los últimos 6 meses' });

        const nueva = await Postulacion.create({
            id_candidato,
            rut: perfil.numero_identificacion,
            nombre: perfil.nombre,
            apellido_paterno: perfil.apellido_paterno,
            apellido_materno: perfil.apellido_materno,
            id_cargo: cargo,
            id_estamento: estamento,
            fecha_postulacion: new Date()
        });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/*  < dejo el prospecto de código limpio asumiendo que SQL esta conectado, toca verificar si hay cambios despues
const { Postulacion, Candidato } = require('../models');
const obtenerDatosCandidato = require('../utils/obtenerRutYId');
const { Op } = require('sequelize');

exports.crearPostulacion = async (req, res) => {
    try {
        const { id_candidato } = await obtenerDatosCandidato(req);
        const { id_estamento, id_cargo } = req.body;

        const perfil = await Candidato.findByPk(id_candidato);

        const hace6Meses = new Date();
        hace6Meses.setMonth(hace6Meses.getMonth() - 6);

        const existe = await Postulacion.findOne({
            where: {
                id_candidato,
                id_cargo,
                fecha_postulacion: { [Op.gte]: hace6Meses }
            }
        });

        if (existe) {
            return res.status(400).json({ 
                mensaje: 'Recuerde que solo se puede realizar una postulación cada 6 meses para el mismo cargo' 
            });
        }

        const nueva = await Postulacion.create({
            id_candidato,
            rut: perfil.numero_identificacion,
            nombre: perfil.nombre,
            apellido_paterno: perfil.apellido_paterno,
            apellido_materno: perfil.apellido_materno,
            id_estamento,
            id_cargo,
            fecha_postulacion: new Date(),
            estado: 'PENDIENTE'
        });

        res.status(201).json(nueva);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMisPostulaciones = async (req, res) => {
    try {
        const { id_candidato } = await obtenerDatosCandidato(req);

        const data = await Postulacion.findAll({
            where: { id_candidato },
            order: [['fecha_postulacion', 'DESC']]
        });

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
*/