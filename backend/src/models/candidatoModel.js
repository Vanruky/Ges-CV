const db = require('../config/db');

const Candidato = {
    crearPerfil: async (id_usuario, datos) => {

        const sql = `
            INSERT INTO candidato
            (id_usuario, tipo_identificacion, numero_identificacion, nombre, apellido_paterno, apellido_materno, celular)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            id_usuario,
            datos.tipo_identificacion,
            datos.numero_identificacion,
            datos.nombre,
            datos.apellido_paterno,
            datos.apellido_materno,
            datos.celular
        ];
        const [result] = await db.query(sql, valores);
        return result.insertId;
    },

    obtenerPerfil: async (id_usuario) => {
        const sql = `SELECT
                u.correo,
                c.id_candidato,
                c.tipo_identificacion,
                c.numero_identificacion,
                c.nombre,
                c.apellido_paterno,
                c.apellido_materno,
                c.celular,
                c.rut_editado,
                c.nombre_apellidos_editados
            FROM usuario u
            INNER JOIN candidato c ON u.id_usuario = c.id_usuario
            WHERE u.id_usuario = ?`;

        const [rows] = await db.query(sql, [id_usuario]);
        return rows[0];

    },

    // para actualizar la informacion , el rut,nombre y apellidos solo se edita 1 vez

    actualizarPerfil: async (id_usuario, datos) => {
        const [rows] = await db.query(
        'SELECT rut_editado, nombre_apellidos_editados FROM candidato WHERE id_usuario = ?',
        [id_usuario]
        );
    if (rows.length === 0) return false;

    const { rut_editado, nombre_apellidos_editados } = rows[0];
    let campos = ['celular = ?'];
    let valores = [datos.celular];

    if (rut_editado === 0) {

        campos.push('tipo_identificacion = ?', 'numero_identificacion = ?', 'rut_editado = 1');
        valores.push(datos.tipo_identificacion, datos.numero_identificacion);
    }

    if (nombre_apellidos_editados === 0) {
        campos.push('nombre = ?', 'apellido_paterno = ?', 'apellido_materno = ?', 'nombre_apellidos_editados = 1');
        valores.push(datos.nombre, datos.apellido_paterno, datos.apellido_materno);
    }

    const sql = `UPDATE candidato SET ${campos.join(', ')} WHERE id_usuario = ?`;
    valores.push(id_usuario);
    const [result] = await db.query(sql, valores);

    return result.affectedRows > 0;
},
};

module.exports = Candidato;