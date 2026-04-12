const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Usuario = sequelize.define('Usuario', {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true, //aca hice correccion porque aparecia con _, como primary_key, toca revisar
        autoIncrement: true
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.ENUM('ADMIN', 'CANDIDATO'),
        defaultValue: 'CANDIDATO'
    }
}, {
    tableName: 'usuario',
    timestamps: false // MySQL ya maneja las fechas por defecto
});

module.exports = Usuario;