const { Candidato } = require('../models');

exports.getPerfil = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({
            where: { id_usuario: req.usuario.id }
        });

        if (!candidato) {
            return res.status(404).json({ mensaje: 'Candidato no encontrado' });
        }

        res.json(candidato);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};