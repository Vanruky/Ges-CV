const { Usuario, Candidato } = require('../models');

/*Con SQL ON: eliminar los return mock, dejando solo la consulta a BD*/
async function obtenerDatosCandidato(req) {
    try {
        const usuario = await Usuario.findByPk(req.usuario.id, {
            include: {
                model: Candidato,
                as: 'perfilCandidato',
                attributes: ['id_candidato', 'numero_identificacion']
            }
        });

        if (usuario && usuario.perfilCandidato) {
            return {
                id_candidato: usuario.perfilCandidato.id_candidato,
                rut: usuario.perfilCandidato.numero_identificacion
            };
        }

        //MOCK
        return {
            id_candidato: 1,
            rut: "12.345.678-9"
        };

    } catch (error) {
        return {
            id_candidato: 1,
            rut: "12.345.678-9"
        };
    }
}

module.exports = obtenerDatosCandidato;