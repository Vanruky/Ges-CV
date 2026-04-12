const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Candidato = sequelize.define('Candidato', {
    id_candidato: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo_identificacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    numero_identificacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_paterno: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido_materno: {
        type: DataTypes.STRING
    },
    celular: {
        type: DataTypes.STRING
    },
    profesion: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'candidato',
    timestamps: false
});

module.exports = Candidato;