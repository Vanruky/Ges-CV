module.exports = (sequelize, DataTypes) => {
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
        rut_editado: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        correo: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'candidato',
        timestamps: false
    });

    return Candidato;
};