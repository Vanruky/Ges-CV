const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASS, 
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

const Usuario = require('./Usuario')(sequelize, Sequelize.DataTypes);
const Candidato = require('./Candidato')(sequelize, Sequelize.DataTypes);
const Postulacion = require('./Postulacion')(sequelize, Sequelize.DataTypes);

Usuario.hasOne(Candidato, { foreignKey: 'id_usuario', as: 'perfilCandidato' });
Candidato.belongsTo(Usuario, { foreignKey: 'id_usuario' });

/*con SQL ON:
Candidato.hasMany(Postulacion, { foreignKey: 'id_candidato' });
Postulacion.belongsTo(Candidato, { foreignKey: 'id_candidato' });
*/

module.exports = {
    sequelize,
    Sequelize,
    Usuario,
    Candidato,
    Postulacion
};