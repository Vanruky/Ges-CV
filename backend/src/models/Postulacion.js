/*id_candidato > uso interno, rut > uso lógico (validaciones y reglas de negocio) CON SQL ON: id_candidato debe ser FK hacia tabla candidato*/

module.exports = (sequelize, DataTypes) => {
    const Postulacion = sequelize.define('Postulacion', {
        id_postulacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        id_candidato: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        rut: {
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
        estamento: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cargo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        archivo: {
            type: DataTypes.STRING
        },
        fecha_postulacion: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        cuestionario_realizado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        fecha_cuestionario: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'postulacion',
        timestamps: false
    });

    return Postulacion;
};