const db =require('../config/db')

const Postulacion = {

    crearPostulacion: async (id_candidato, datos) => {
        const sql = `
            INSERT INTO postulacion 
            (id_candidato, id_cargo, id_estamento)
            VALUES (?,?,?)
        `;

        const valores = [
            id_candidato,
            datos.id_cargo,
            datos.id_estamento
        ];

        const [result] = await db.query(sql, valores);

        return result.insertId;
    },

    obtenerPorCandidato: async (id_candidato) => {
        const sql = `
            SELECT 
                p.id_postulacion, 
                c.nombre AS nombre_cargo, 
                e.nombre AS nombre_estamento, 
                p.fecha_postulacion, 
                ep.nombre AS nombre_estado
            FROM postulacion p
            JOIN cargo c ON p.id_cargo = c.id_cargo
            JOIN estamento e ON p.id_estamento = e.id_estamento
            JOIN estado_postulacion ep ON p.id_estado = ep.id_estado
            WHERE p.id_candidato = ?
        `;
        const [rows] = await db.query(sql, [id_candidato]);
        return rows;
    },

    verificarDuplicado: async (id_candidato, id_cargo) => {
    const sql = `SELECT id_postulacion FROM postulacion WHERE id_candidato = ? AND id_cargo = ?`;
    const [rows] = await db.query(sql, [id_candidato, id_cargo]);
    return rows.length > 0; 
}
};

module.exports = Postulacion;