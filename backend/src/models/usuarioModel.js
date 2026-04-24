const db = require('../config/db')

const Candidato = {
    // creo un usuario
    crearUsuario: async (correo, password_hash) => {
        const sql = `INSERT INTO usuario (correo, password_hash, rol) VALUES (?, ?, 'CANDIDATO')`;
        const [result] = await db.query(sql, [correo, password_hash]);
        return result.insertId; 
    },


    // funcion para ingresar inf de la cuenta
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

    // para saber si se encuentra el usuario guardado con el correo
    obtenerPorCorreo: async (correo) => {
        const sql = `
            SELECT u.id_usuario, u.correo, u.password_hash, u.rol, c.id_candidato, c.nombre AS usuario_nombre
            FROM usuario u
            LEFT JOIN candidato c ON u.id_usuario = c.id_usuario
            WHERE u.correo = ?
        `;
        const [rows] = await db.query(sql, [correo]);
        return rows[0]; 
    },
    
    // funcion que me trae toda la informacion de la cuenta
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
                c.rut_editado 
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


    actualizarContrasenia: async (id_usuario, nuevoPasswordHash) => {
    const sql = `UPDATE usuario SET password_hash = ? WHERE id_usuario = ?`;
    const [result] = await db.query(sql, [nuevoPasswordHash, id_usuario]);
    return result.affectedRows > 0;
},
};

module.exports = Candidato;