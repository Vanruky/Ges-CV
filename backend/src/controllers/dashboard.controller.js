const { Postulacion, Candidato } = require('../models');
const obtenerDatosCandidato = require('../utils/obtenerDatosCandidato');

exports.getDashboard = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;

        const [perfil, postulaciones] = await Promise.all([
            Candidato.obtenerPerfil(id_usuario),
            obtenerDatosCandidato(req).then(datos => 
                datos ? Postulacion.obtenerPorCandidato(datos.id_candidato) : []
            )
        ]);

        if (!perfil) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.json({
            usuario: {
                nombre_completo: `${perfil.nombre} ${perfil.apellido_paterno} ${perfil.apellido_materno}`,
                rut: perfil.numero_identificacion
            },
            postulaciones: postulaciones.map(p => ({
                id: p.id_postulacion,
                cargo: p.nombre_cargo,
                estamento: p.nombre_estamento,
                fecha: p.fecha_postulacion,
                estado: p.nombre_estado
            }))
        });

    } catch (error) {
        console.error("Error en Dashboard:", error);
        res.status(500).json({ error: "Error al cargar los datos del dashboard" });
    }
};