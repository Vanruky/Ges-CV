const Usuario = require('./Usuario');
const Candidato = require('./Candidato');

//Revisar** yo deje como relación 1 a 1
Usuario.hasOne(Candidato, { foreignKey: 'id_usuario' });
Candidato.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = {
    Usuario,
    Candidato
};