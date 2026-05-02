const db = require('../config/db');


// POSTULACIONES (HISTORIAL)
const getPostulaciones = async (filters = {}) => {

    let sql = `
        SELECT 
            p.id_postulacion,
            p.fecha_postulacion AS fecha,
            ep.nombre AS estado,
            c.nombre AS cargo,

            CONCAT(
                ca.nombre, ' ',
                ca.apellido_paterno, ' ',
                IFNULL(ca.apellido_materno, '')
            ) AS postulante,

            cv.nombre_archivo_servidor AS cv_url

        FROM postulacion p
        JOIN estado_postulacion ep ON p.id_estado = ep.id_estado
        JOIN cargo c ON p.id_cargo = c.id_cargo
        JOIN candidato ca ON p.id_candidato = ca.id_candidato

        LEFT JOIN curriculum cv 
            ON cv.id_cv = (
                SELECT id_cv
                FROM curriculum
                WHERE id_candidato = ca.id_candidato
                ORDER BY fecha_subida DESC
                LIMIT 1
        )

        WHERE 1=1
    `;

    const params = [];

    if (filters.texto) {
        sql += `
            AND (
                LOWER(CONCAT(
                    ca.nombre, ' ',
                    ca.apellido_paterno, ' ',
                    IFNULL(ca.apellido_materno,'')
                )) LIKE ?
                OR LOWER(c.nombre) LIKE ?
                OR LOWER(ep.nombre) LIKE ?
            )
        `;
        const texto = `%${filters.texto.toLowerCase()}%`;
        params.push(texto, texto, texto);
    }

    if (filters.desde) {
        sql += ` AND p.fecha_postulacion >= ?`;
        params.push(filters.desde + ' 00:00:00');
    }

    if (filters.hasta) {
        sql += ` AND p.fecha_postulacion < DATE_ADD(?, INTERVAL 1 DAY)`;
        params.push(filters.hasta);
    }

    if (filters.ids) {
        const idsArray = filters.ids.split(',').map(id => Number(id));

        if (idsArray.length > 0) {
            const placeholders = idsArray.map(() => '?').join(',');
            sql += ` AND p.id_postulacion IN (${placeholders})`;
            params.push(...idsArray);
        }
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


// REPORTES
const getReportes = async (filters = {}) => {

    let sql = `
        SELECT 
            r.id_reporte,
            r.tipo_reporte,
            r.descripcion,
            r.url_documento,
            r.fecha_generacion,
            u.correo AS generado_por
        FROM reporte r
        JOIN usuario u ON r.id_usuario = u.id_usuario
        WHERE 1=1
    `;

    const params = [];

    if (filters.texto && filters.texto !== '') {
        sql += `
            AND (
                REPLACE(LOWER(r.tipo_reporte), '_', ' ') LIKE ?
                OR LOWER(r.descripcion) LIKE ?
                OR LOWER(u.correo) LIKE ?
            )
        `;
        const texto = `%${filters.texto.toLowerCase()}%`;
        params.push(texto, texto, texto);
    }

    if (filters.desde && filters.desde !== '') {
        sql += ` AND r.fecha_generacion >= ?`;
        params.push(filters.desde + ' 00:00:00');
    }

    if (filters.hasta && filters.hasta !== '') {
        sql += ` AND r.fecha_generacion < DATE_ADD(?, INTERVAL 1 DAY)`;
        params.push(filters.hasta);
    }

    sql += ` ORDER BY r.fecha_generacion DESC`;

    const [rows] = await db.query(sql, params);

    return rows.map(r => ({
        id_reporte: r.id_reporte,
        tipo_reporte: r.tipo_reporte,
        descripcion: r.descripcion,
        url_documento: r.url_documento,
        fecha_generacion: r.fecha_generacion,
        generado_por: r.generado_por
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

    const [userRows] = await db.query(`
        SELECT correo 
        FROM usuario 
        WHERE id_usuario = ?
    `, [id_usuario]);

    return {
        id_reporte: result.insertId,
        tipo_reporte,
        descripcion,
        url_documento,
        fecha_generacion: new Date(),
        generado_por: userRows[0]?.correo || null
    };
};


module.exports = {
    getPostulaciones,
    deletePostulaciones,
    getReportes,
    createReporte
};