const db = require('../config/db')

const Usuario = {
    // Registro básico para cualquier rol
    crear: async (correo, password_hash, rol = 'CANDIDATO') => {
        const sql = `INSERT INTO usuario (correo, password_hash, rol) VALUES (?, ?, ?)`;
        const [result] = await db.query(sql, [correo, password_hash, rol]);
        return result.insertId;
    },

// Login 
    obtenerPorCorreo: async (correo) => {
        const sql = `
            SELECT 
                u.id_usuario AS id, 
                u.correo, 
                u.password_hash, 
                u.rol, 
                c.nombre 
            FROM usuario u
            LEFT JOIN candidato c ON u.id_usuario = c.id_usuario
            WHERE u.correo = ?
        `;
        const [rows] = await db.query(sql, [correo]);
        return rows[0];
    },

    //actualizacion de contra
    actualizarContrasenia: async (id_usuario, nuevoHash) => {
        const sql = `UPDATE usuario SET password_hash = ? WHERE id_usuario = ?`;
        const [result] = await db.query(sql, [nuevoHash, id_usuario]);
        return result.affectedRows > 0;
    },
};

module.exports = Usuario;