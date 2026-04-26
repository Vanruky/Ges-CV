const { Candidato } = require('../models');

exports.obtenerPerfil = async (req, res) => {
    try {
        const id_usuario = req.usuario.id; 
        const candidato = await Candidato.obtenerPerfil(id_usuario);

        if (!candidato) {
            return res.status(404).json({ mensaje: "Candidato no encontrado" });
        }

        res.json(candidato);
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.actualizarPerfil = async (req, res) => {
    try {
        const id_usuario = req.usuario.id;
        const datosNuevos = req.body; 

        // el bloqueo de no cambiar la info mas de 1  vez esta en el modelo no en aca en el controlador porsiaca
        const resultado = await Candidato.actualizarPerfil(id_usuario, datosNuevos);

        if (!resultado) {
            return res.status(400).json({ 
                mensaje: "No se pudo actualizar. Es posible que el usuario no exista o ya no pueda editar ciertos campos." 
            });
        }

        res.json({ mensaje: "Perfil actualizado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




/*const { Candidato } = require('../models');
const USE_MOCK = true; 
let candidatoMock = {
    id_candidato: 1,
    id_usuario: 1,
    numero_identificacion: "12.345.678-9",
    rut_editado: 0,
    nombre: "Miren",
    apellido_paterno: "Romero",
    apellido_materno: "Test",
    correo: "test@test.com",
    celular: "123456789"
};

exports.getPerfil = async (req, res) => {
    try {
        if (USE_MOCK) {
            return res.json({
                ...candidatoMock,
                nombre_completo: `${candidatoMock.nombre} ${candidatoMock.apellido_paterno} ${candidatoMock.apellido_materno}`
            });
        }

        const candidato = await Candidato.findOne({ where: { id_usuario: req.usuario.id } });
        res.json({
            ...candidato.dataValues,
            nombre_completo: `${candidato.nombre} ${candidato.apellido_paterno} ${candidato.apellido_materno}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePerfil = async (req, res) => {
    try {
        const { numero_identificacion, nombre, apellido_paterno, apellido_materno, correo, celular } = req.body;

        if (USE_MOCK) {
            const cambioIdentidad = 
                numero_identificacion !== candidatoMock.numero_identificacion ||
                nombre !== candidatoMock.nombre ||
                apellido_paterno !== candidatoMock.apellido_paterno ||
                apellido_materno !== candidatoMock.apellido_materno;

            if (cambioIdentidad) {
                if (candidatoMock.rut_editado === 1) {
                    return res.status(400).json({
                        mensaje: "Los datos de identidad (RUT, Nombre y Apellidos) ya fueron modificados anteriormente."
                    });
                }
                candidatoMock.numero_identificacion = numero_identificacion;
                candidatoMock.nombre = nombre;
                candidatoMock.apellido_paterno = apellido_paterno;
                candidatoMock.apellido_materno = apellido_materno;
                candidatoMock.rut_editado = 1;
            }
            candidatoMock.correo = correo;
            candidatoMock.celular = celular;
            return res.json({ mensaje: "Perfil actualizado (mock)", data: candidatoMock });
        }

        const candidato = await Candidato.findOne({ where: { id_usuario: req.usuario.id } });
        const cambioIdentidadSQL = 
            numero_identificacion !== candidato.numero_identificacion ||
            nombre !== candidato.nombre ||
            apellido_paterno !== candidato.apellido_paterno ||
            apellido_materno !== candidato.apellido_materno;

        if (cambioIdentidadSQL) {
            if (candidato.rut_editado === 1) {
                return res.status(400).json({ mensaje: "Identidad bloqueada: ya se realizó una edición previa." });
            }
            candidato.rut_editado = 1;
            candidato.numero_identificacion = numero_identificacion;
            candidato.nombre = nombre;
            candidato.apellido_paterno = apellido_paterno;
            candidato.apellido_materno = apellido_materno;
        }
        candidato.correo = correo;
        candidato.celular = celular;
        await candidato.save();
        res.json({ mensaje: "Perfil actualizado", data: candidato });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


< dejo el prospecto de código limpio asumiendo que SQL esta conectado, toca verificar si hay cambios despues
const { Candidato } = require('../models');

exports.getPerfil = async (req, res) => {
    try {
        const candidato = await Candidato.findOne({ 
            where: { id_usuario: req.usuario.id } 
        });

        if (!candidato) {
            return res.status(404).json({ mensaje: "Perfil no encontrado" });
        }

        res.json({
            ...candidato.dataValues,
            nombre_completo: `${candidato.nombre} ${candidato.apellido_paterno} ${candidato.apellido_materno}`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePerfil = async (req, res) => {
    try {
        const { numero_identificacion, nombre, apellido_paterno, apellido_materno, correo, celular } = req.body;

        const candidato = await Candidato.findOne({ 
            where: { id_usuario: req.usuario.id } 
        });

        const cambioIdentidad = 
            numero_identificacion !== candidato.numero_identificacion ||
            nombre !== candidato.nombre ||
            apellido_paterno !== candidato.apellido_paterno ||
            apellido_materno !== candidato.apellido_materno;

        if (cambioIdentidad) {
            // Regla de seguridad: Si rut_editado es 1, ya no se puede cambiar la identidad
            if (candidato.rut_editado === 1) {
                return res.status(400).json({ 
                    mensaje: "Los datos de identidad ya fueron validados y editados anteriormente. No se permiten más cambios por seguridad." 
                });
            }
            candidato.numero_identificacion = numero_identificacion;
            candidato.nombre = nombre;
            candidato.apellido_paterno = apellido_paterno;
            candidato.apellido_materno = apellido_materno;
            candidato.rut_editado = 1;
        }

        candidato.correo = correo;
        candidato.celular = celular;

        await candidato.save();

        res.json({ 
            mensaje: "Perfil actualizado correctamente", 
            data: candidato 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
*/