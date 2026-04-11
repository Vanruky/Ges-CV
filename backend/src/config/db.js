const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
);

// Probar la conexión
sequelize.authenticate()
    .then(() => console.log('✅ Conexión a MySQL exitosa.'))
    .catch(err => console.error('❌ Error al conectar a MySQL:', err));

module.exports = sequelize;