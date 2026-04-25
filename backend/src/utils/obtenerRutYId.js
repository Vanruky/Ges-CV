const db = require('../config/db');

async function obtenerDatosCandidato(req) {
    try {
        // esto revisa el ID del usuario desde el token 
        const id_usuario = req.usuario.id;

        // buscar perfil 
        const sql = `
            SELECT c.id_candidato, c.numero_identificacion as rut
            FROM usuario u
            JOIN candidato c ON u.id_usuario = c.id_usuario
            WHERE u.id_usuario = ?
        `;
        //el traductor de la base de datos
        const [rows] = await db.query(sql, [id_usuario]);
        //buscar filas y ver si aparece info (en este caso si hay algo es mas que 0)
        if (rows.length > 0) {
            return {
                id_candidato: rows[0].id_candidato,
                rut: rows[0].rut
            };
        }

        // Si no encuentra nada lanza el error (puede ser un admin pero el admin no tiene porque postular)
        throw new Error('No se encontró el perfil de candidato para este usuario');

    } catch (error) {
        console.error("Error en obtenerDatosCandidato:", error);
        return { id_candidato: null, rut: null };
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