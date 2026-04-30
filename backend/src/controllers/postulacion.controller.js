const { Postulacion, Curriculum } = require('../models'); 
const obtenerDatosCandidato = require('../utils/obtenerDatosCandidato');

exports.crearPostulacion = async (req, res) => {
    try {
        const datos = await obtenerDatosCandidato(req);
        if (!datos || !datos.id_candidato) {
            return res.status(403).json({ mensaje: "Perfil de candidato no encontrado" });
        }

        const id_candidato = datos.id_candidato;
        const { id_cargo, id_estamento } = req.body;

        if (!id_cargo || !id_estamento) {
            return res.status(400).json({ mensaje: "Cargo y Estamento son obligatorios" });
        }

        const existe = await Postulacion.verificarDuplicado(id_candidato, id_cargo);
        if (existe) {
            return res.status(400).json({ mensaje: 'Ya posees una postulación activa para este cargo.' });
        }

        const id_nueva_postulacion = await Postulacion.crearPostulacion(id_candidato, { id_cargo, id_estamento });

        if (req.file) {
            await Curriculum.subir(id_candidato, req.file.originalname, req.file.filename);
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
//historial
exports.getMisPostulaciones = async (req, res) => {
    try {
        const { id_candidato } = await obtenerDatosCandidato(req);
        const data = await Postulacion.obtenerPorCandidato(id_candidato);
        res.json(data);
    } catch (error) {
        console.error("Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener tus postulaciones" });
    }
};