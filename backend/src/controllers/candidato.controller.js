const { Candidato } = require('../models');

exports.obtenerPerfil = async (req, res) => {
    try {
        const id_usuario = req.usuario.id; 
        const candidato = await Candidato.obtenerPerfil(id_usuario);

        if (!candidato) {
            return res.status(404).json({ mensaje: "Candidato no encontrado" });
        }

        const respuesta = {
            ...candidato,
            nombre_completo: `${candidato.nombre} ${candidato.apellido_paterno} ${candidato.apellido_materno}`
        };

        res.json(respuesta);
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarPerfil = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const datosNuevos = req.body; 

        const resultado = await Candidato.actualizarPerfil(id_usuario, datosNuevos);

        if (!resultado) {
            return res.status(400).json({ 
                mensaje: "No se pudo actualizar. Es posible que el perfil ya esté bloqueado para edición de identidad." 
            });
        }

        res.json({ mensaje: "Perfil actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};