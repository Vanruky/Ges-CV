const { Sequelize } = require('sequelize');
require('dotenv').config();

// 1. Configurar la conexión (usando variables de tu archivo .env)
const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // Ponlo en true si quieres ver las consultas SQL en la consola
    }
);

// 2. Importar los modelos
const Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
const Candidato = require('./Candidato')(sequelize, Sequelize.DataTypes);

// 3. Definir las relaciones (Lo que ya tenías, ¡está perfecto!)
// Relación 1 a 1: Un Usuario tiene un perfil de Candidato
Usuario.hasOne(Candidato, { foreignKey: 'id_usuario', as: 'perfilCandidato' });
Candidato.belongsTo(Usuario, { foreignKey: 'id_usuario' });

// 4. Exportar todo
module.exports = {
    sequelize,
    Sequelize,
    Usuario,
    Candidato
};