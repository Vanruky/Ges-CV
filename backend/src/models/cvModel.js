const db = require('../config/db');

const Curriculum = {
    // Guardar la referencia del archivo local
    subir: async (id_candidato, nombreOriginal, nombreServidor) => {
        const sql = `
            INSERT INTO curriculum (id_candidato, nombre_archivo_original, nombre_archivo_servidor)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(sql, [id_candidato, nombreOriginal, nombreServidor]);
        return result.insertId;
    },

    // Obtener el  archivo subido 
    obtenerPorCandidato: async (id_candidato) => {
        const sql = `
            SELECT * FROM curriculum 
            WHERE id_candidato = ? 
            ORDER BY fecha_subida DESC LIMIT 1
        `;
        const [rows] = await db.query(sql, [id_candidato]);
        return rows[0];
    }
};

module.exports = Curriculum;
