const db = require('../config/db');


const db = require('../config/db');


const getPostulaciones = async (filters = {}) => {

    let sql = `
        SELECT 
            p.id_postulacion,
            p.fecha_postulacion,
            ep.nombre AS estado,
            c.nombre AS cargo,
            CONCAT(
                ca.nombre, ' ',
                ca.apellido_paterno, ' ',
                IFNULL(ca.apellido_materno, '')
            ) AS candidato
        FROM postulacion p
        JOIN estado_postulacion ep ON p.id_estado = ep.id_estado
        JOIN cargo c ON p.id_cargo = c.id_cargo
        JOIN candidato ca ON p.id_candidato = ca.id_candidato
        WHERE 1=1
    `;

    const params = [];

    if (filters.estado) {
        sql += ` AND p.id_estado = ?`;
        params.push(filters.estado);
    }

    if (filters.cargo) {
        sql += ` AND p.id_cargo = ?`;
        params.push(filters.cargo);
    }

    if (filters.nombre) {
        sql += `
            AND CONCAT(ca.nombre, ' ', ca.apellido_paterno, ' ', IFNULL(ca.apellido_materno,'')) LIKE ?
        `;
        params.push(`%${filters.nombre}%`);
    }

    if (filters.desde && filters.hasta) {
        sql += ` AND p.fecha_postulacion BETWEEN ? AND ?`;
        params.push(filters.desde, filters.hasta);
    }

    sql += ` ORDER BY p.fecha_postulacion DESC`;

    const [rows] = await db.query(sql, params);
    return rows;
};


const deletePostulaciones = async (ids) => {

    if (!Array.isArray(ids) || ids.length === 0) return;

    const placeholders = ids.map(() => '?').join(',');

    await db.query(`
        DELETE FROM postulacion
        WHERE id_postulacion IN (${placeholders})
    `, ids);
};


const getReportes = async () => {

    const [rows] = await db.query(`
        SELECT 
            r.id_reporte,
            r.tipo_reporte,
            r.descripcion,
            r.url_documento,
            r.fecha_generacion,
            u.id_usuario,
            u.correo AS usuario_correo
        FROM reporte r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        ORDER BY r.fecha_generacion DESC
    `);

    return rows.map(r => ({
        id_reporte: r.id_reporte,
        tipo_reporte: r.tipo_reporte,
        descripcion: r.descripcion,
        url_documento: r.url_documento,
        fecha_generacion: r.fecha_generacion,
        usuario: {
            id: r.id_usuario,
            correo: r.usuario_correo
        }
    }));
};


const createReporte = async (reporte) => {

    const { id_usuario, tipo_reporte, descripcion, url_documento } = reporte;

    const [result] = await db.query(`
        INSERT INTO reporte 
        (id_usuario, tipo_reporte, descripcion, url_documento)
        VALUES (?, ?, ?, ?)
    `, [
        id_usuario,
        tipo_reporte,
        descripcion,
        url_documento
    ]);

    return {
        id_reporte: result.insertId,
        id_usuario,
        tipo_reporte,
        descripcion,
        url_documento,
        fecha_generacion: new Date()
    };
};


module.exports = {
    getPostulaciones,
    deletePostulaciones,
    getReportes,
    createReporte
};

const deletePostulaciones = async (ids) => {

    if (!Array.isArray(ids) || ids.length === 0) return;

    const placeholders = ids.map(() => '?').join(',');

    await db.query(`
        DELETE FROM postulacion
        WHERE id_postulacion IN (${placeholders})
    `, ids);
};


const getReportes = async () => {

    const [rows] = await db.query(`
        SELECT 
            r.id_reporte,
            r.tipo_reporte,
            r.descripcion,
            r.url_documento,
            r.fecha_generacion,
            u.id_usuario,
            u.correo AS usuario_correo
        FROM reporte r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        ORDER BY r.fecha_generacion DESC
    `);

    return rows.map(r => ({
        id_reporte: r.id_reporte,
        tipo_reporte: r.tipo_reporte,
        descripcion: r.descripcion,
        url_documento: r.url_documento,
        fecha_generacion: r.fecha_generacion,
        usuario: {
            id: r.id_usuario,
            correo: r.usuario_correo
        }
    }));
};


const createReporte = async (reporte) => {

    const { id_usuario, tipo_reporte, descripcion, url_documento } = reporte;

    const [result] = await db.query(`
        INSERT INTO reporte 
        (id_usuario, tipo_reporte, descripcion, url_documento)
        VALUES (?, ?, ?, ?)
    `, [
        id_usuario,
        tipo_reporte,
        descripcion,
        url_documento
    ]);

    return {
        id_reporte: result.insertId,
        id_usuario,
        tipo_reporte,
        descripcion,
        url_documento,
        fecha_generacion: new Date()
    };
};


module.exports = {
    getPostulaciones,
    deletePostulaciones,
    getReportes,
    createReporte
};