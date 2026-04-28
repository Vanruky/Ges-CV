const db = require('../config/db');

const Admin = {
    getPostulaciones : async (filtros) => {
    const { estado, cargo, postulante } = filtros;

    let sql = `
        SELECT 
            p.id_postulacion, 
            p.fecha_postulacion AS fecha, 
            CONCAT(c.nombre, ' ', c.apellido_paterno) AS postulante, 
            car.nombre AS cargo, 
            ep.nombre AS estado
        FROM postulacion p
        JOIN candidato c ON p.id_candidato = c.id_candidato
        JOIN cargo car ON p.id_cargo = car.id_cargo
        JOIN estado_postulacion ep ON p.id_estado = ep.id_estado
        WHERE 1=1
    `;
    const params = [];

    if (estado) {
        sql += ' AND ep.nombre = ?';
        params.push(estado);
    }
    if (cargo) {
        sql += ' AND car.nombre LIKE ?';
        params.push(`%${cargo}%`);
    }
    if (postulante) {
        sql += ' AND (c.nombre LIKE ? OR c.apellido_paterno LIKE ?)';
        params.push(`%${postulante}%`, `%${postulante}%`);
    }

    sql += ' ORDER BY p.fecha_postulacion DESC';

    const [rows] = await db.query(sql, params);
    return rows;
},

/**
 * Elimina registros por ID.
 */
    deletePostulaciones : async (ids) => {
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM postulacion WHERE id_postulacion IN (${placeholders})`;
    
    const [result] = await db.query(sql, ids);
    return result;
},

//Obtiene el listado de reportes generados y el correo para tener el registro de lo que hace cada admin 

    getReportes : async (filtros) => {
    let sql = `
        SELECT 
            r.id_reporte, 
            r.tipo_reporte, 
            r.descripcion, 
            r.url_documento, 
            r.fecha_generacion,
            u.correo
        FROM reporte r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        WHERE 1=1
    `;
    const params = [];

    if (filtros && filtros.tipo_reporte) {
        sql += ' AND r.tipo_reporte = ?';
        params.push(filtros.tipo_reporte);
    }

    sql += ' ORDER BY r.fecha_generacion DESC';

    const [rows] = await db.query(sql, params);
    
    return rows.map(r => ({
        id_reporte: r.id_reporte,
        tipo_reporte: r.tipo_reporte,
        descripcion: r.descripcion,
        url_documento: r.url_documento,
        fecha_generacion: r.fecha_generacion,
        usuario: {
            correo: r.correo
        }
    }));
},

/**
 * Crea un registro en la tabla reporte.
 */
    createReporte : async (data) => {
    const { tipo_reporte, descripcion, id_usuario, url_documento } = data;
    
    const sql = `
        INSERT INTO reporte (id_usuario, tipo_reporte, descripcion, url_documento)
        VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [
        id_usuario, 
        tipo_reporte, 
        descripcion, 
        url_documento
    ]);

    return { 
        id_reporte: result.insertId, 
        ...data 
    };
}
};

module.exports = Admin;