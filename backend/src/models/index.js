/*este archivo sirve para no poner mil lineas por controlador
y solo usar una sola que interactue con los modelos*/


module.exports = {
    Candidato: require('./usuarioModel'),
    Cargo: require('./cargoModel'),
    Postulacion: require('./postulacionModel')
};