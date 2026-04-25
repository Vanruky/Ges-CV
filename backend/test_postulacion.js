// test_postulacion.js
const Postulacion = require('./src/models/postulacionModel');

async function probarNuevaPostulacion() {
    try {
        console.log('--- 🏥 INICIANDO PRUEBA DE POSTULACIÓN ---');

        // 1. El ID que ya conocemos (El de Javiera Novoa que creamos antes)
        const idDelCandidatoQueYaExiste = 1; 

        // 2. Los DATOS nuevos (Lo que el usuario elige en el formulario)
        // Probemos con: Cargo 1 (Enfermero/a) y Estamento 1 (Profesional)
        const datosDelFormulario = {
            id_cargo: 1,
            id_estamento: 1
        };

        console.log('Paso 1: Enviando ID del candidato y datos nuevos al modelo...');
        
        // Ejecutamos la función del modelo
        const idPostulacionCreada = await Postulacion.crear(
            idDelCandidatoQueYaExiste, 
            datosDelFormulario
        );

        console.log(`✅ ¡Éxito! Postulación guardada con el ID: ${idPostulacionCreada}`);
        console.log('Paso 2: Verificando en la base de datos...');

        // Opcional: Podríamos llamar a la otra función para ver si aparece en su lista
        const historial = await Postulacion.obtenerPorCandidato(idDelCandidatoQueYaExiste);
        console.log('Historial del candidato:', historial);

        console.log('--- 🎉 PRUEBA FINALIZADA ---');

    } catch (error) {
        console.error('❌ ERROR EN LA PRUEBA:');
        console.error(error.message);
    } finally {
        process.exit();
    }
}

probarNuevaPostulacion();