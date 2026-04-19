// test_db.js
const Candidato = require('./src/models/usuarioModel');

async function probarRegistroCompleto() {
    try {
        console.log('--- 🧪 INICIANDO PRUEBA DE REGISTRO ---');

        // 1. Datos simulados (Cámbialos si quieres probar otro)
        const emailPrueba = "test@gmail.com";
        const passwordSimulada = "123456789";
        
        const datosPersonales = {
            tipo_identificacion: 'RUT',
            numero_identificacion: '1.111.111-1',
            nombre: 'Javiera',
            apellido_paterno: 'Novoa',
            apellido_materno: 'Eeee',
            celular: '912345678'
        };

        // Crear Usuario
        console.log('Paso 1: Creando usuario...');
        const nuevoIdUsuario = await Candidato.crearUsuario(emailPrueba, passwordSimulada);
        console.log(`✅ Usuario creado con ID: ${nuevoIdUsuario}`);

        // 3. Ejecutar Paso 2: Crear Candidato (Perfil)
        console.log('Paso 2: Creando perfil de candidato...');
        const nuevoIdCandidato = await Candidato.crearPerfil(nuevoIdUsuario, datosPersonales);
        console.log(`✅ Perfil vinculado exitosamente. ID Candidato: ${nuevoIdCandidato}`);

        console.log('--- 🎉 PRUEBA FINALIZADA CON ÉXITO ---');
        console.log('Ahora ve a MySQL Workbench y revisa tus tablas.');

    } catch (error) {
        console.error('ERROR DURANTE LA PRUEBA:');
        console.error(error.message);
    } finally {
        process.exit(); // Cierra la conexión
    }
}

probarRegistroCompleto();