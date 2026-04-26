const db = require('../config/db');

async function obtenerDatosCandidato(req) {
    try {
        const id_usuario = req.usuario.id; 

        const sql = `
            SELECT id_candidato, numero_identificacion AS rut
            FROM candidato
            WHERE id_usuario = ?
        `;

        const [rows] = await db.query(sql, [id_usuario]);

        if (rows.length > 0) {
            return {
                id_candidato: rows[0].id_candidato,
                rut: rows[0].rut
            };
        }

        // en el caso del admin no hay fila en candidato
        throw new Error('No se encontró el perfil de candidato para este usuario');

    } catch (error) {
        console.error("Error en obtenerDatosCandidato:", error.message);
        return null; 
    }
}

module.exports = obtenerDatosCandidato;




/* codigo en sequelize 

const { Usuario, Candidato } = require('../models');

Con SQL ON: eliminar los return mock, dejando solo la consulta a BD
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
*/
module.exports = obtenerDatosCandidato;