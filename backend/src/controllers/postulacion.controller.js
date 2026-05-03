const { Postulacion, Curriculum, Cargo } = require('../models'); 
const obtenerDatosCandidato = require('../utils/obtenerDatosCandidato');

exports.obtenerOpciones = async (req, res) => {
    try {
        const data = await Cargo.obtenerTodasFilas(); 
        res.json(data);
    } catch (error) {
        console.error("Error al obtener opciones:", error);
        res.status(500).json({ error: "Error al cargar la lista de cargos" });
    }
};

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

exports.getMisPostulaciones = async (req, res) => {
    try {
        const datos = await obtenerDatosCandidato(req);
        
        // Validación de seguridad para asegurar que existen los datos del candidato
        if (!datos || !datos.id_candidato) {
            return res.json([]);
        }

        const id_candidato = datos.id_candidato;
        const data = await Postulacion.obtenerPorCandidato(id_candidato);
        const dataFormateada = data.map(p => ({
            ...p,
            cargo: p.nombre_cargo, 
            estado: p.nombre_estado 
        }));

        res.json(dataFormateada);
    } catch (error) {
        console.error("Error al obtener historial:", error);
        res.status(500).json({ error: "Error al obtener tus postulaciones" });
    }
};