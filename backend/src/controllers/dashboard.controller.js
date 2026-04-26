

const USE_MOCK = true;
const candidatoMock = { nombre: "Miren", apellido_paterno: "Romero", apellido_materno: "Test" };
const postulacionesMock = [
    { cargo: "Psicólogo", cuestionario_realizado: false, fecha_cuestionario: null, fecha_postulacion: new Date() }
];

exports.getDashboard = async (req, res) => {
    try {
        if (USE_MOCK) {
            return res.json({
                usuario: {
                    nombre_completo: `${candidatoMock.nombre} ${candidatoMock.apellido_paterno} ${candidatoMock.apellido_materno}`
                },
                postulaciones: postulacionesMock.map(p => ({
                    ...p,
                    estado_cuestionario: p.cuestionario_realizado
                        ? `Realizado el ${new Date(p.fecha_cuestionario).toLocaleDateString()}`
                        : "Pendiente"
                }))
            });
        }

        res.json({ mensaje: "Conexión a base de datos en proceso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/*  < dejo el prospecto de código limpio asumiendo que SQL esta conectado, toca verificar si hay cambios despues
const { Candidato, Postulacion } = require('../models');

exports.getDashboard = async (req, res) => {
    try {
        // Obtenemos perfil y postulaciones en paralelo para mayor eficiencia
        const [candidato, postulaciones] = await Promise.all([
            Candidato.findOne({ where: { id_usuario: req.usuario.id } }),
            Postulacion.findAll({ 
                where: { id_usuario: req.usuario.id }, // O por id_candidato
                limit: 5,
                order: [['fecha_postulacion', 'DESC']]
            })
        ]);

        res.json({
            usuario: {
                nombre_completo: `${candidato.nombre} ${candidato.apellido_paterno} ${candidato.apellido_materno}`
            },
            postulaciones: postulaciones.map(p => ({
                fecha: p.fecha_postulacion,
                cargo: p.cargo,
                estado_cuestionario: p.cuestionario_realizado 
                    ? `Realizado el ${new Date(p.fecha_cuestionario).toLocaleDateString()}` 
                    : "Pendiente"
            }))
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
*/