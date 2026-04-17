const USE_MOCK = true;
/*CON SQL ON: borrar*/
let candidatoMock = {
    nombre: "Miren",
    apellido_paterno: "Romero",
    apellido_materno: "Test"
};

let postulacionesMock = [
    {
        cargo: "Psicologo",
        cuestionario_realizado: false,
        fecha_cuestionario: null
    }
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

        //SQL ON
        res.json({});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};