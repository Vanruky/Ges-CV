const db = require('../config/db');

// obtener todos los cargos guardados mostrando el nombre del cargo y el del estamento 
const Cargo = {
    obtenerTodasFilas: async () => {
        const sql = `
            SELECT 
                c.id_cargo, 
                c.nombre AS nombre_cargo, 
                e.nombre AS nombre_estamento
            FROM cargo c 
            JOIN estamento e ON c.id_estamento = e.id_estamento
            ORDER BY e.nombre, c.nombre 
        `;
        const [rows] = await db.query(sql);
        return rows; 
    }
};

module.exports = Cargo;