const Candidato = require('../backend/src/models/usuarioModel');

async function flujoCompletoPerfil() {
    console.log("--- 🚀 INICIANDO PRUEBA DE FLUJO COMPLETO ---");

    try {
        // 1. CREAR EL USUARIO (La cuenta)
        // Simulamos que el hash 
        const emailPrueba = `test.${Date.now()}@hosp.gob`; 
        const passHash = '$2b$10$EjemploDeHashSeguro123456789';

        console.log("\n1️⃣ Creando cuenta de usuario...");
        const idUsuarioCreado = await Candidato.crearUsuario(emailPrueba, passHash);
        console.log(`✅ Usuario creado con ID: ${idUsuarioCreado}`);

        // 2. CREAR EL PERFIL (La información del candidato)
        const datosPerfil = {
            tipo_identificacion: 'RUT',
            numero_identificacion: '12.222.600-9',
            nombre: 'Javiera Belen',
            apellido_paterno: 'Novoa',
            apellido_materno: 'Espejo',
            celular: '+11111111'
        };

        console.log("\n2️⃣ Llenando perfil del candidato...");
        const idCandidatoCreado = await Candidato.crearPerfil(idUsuarioCreado, datosPerfil);
        console.log(`✅ Perfil vinculado con ID: ${idCandidatoCreado}`);

        // 3. RECUPERAR PARA EL FRONT (La prueba de fuego)
        console.log("\n3️⃣ Recuperando información para el Front-end...");
        const perfilParaFront = await Candidato.obtenerPerfil(idUsuarioCreado);

        if (perfilParaFront) {
            console.log("⭐ ¡ÉXITO! Los datos llegaron con los alias correctos:");
            console.table([perfilParaFront]);
        }

        // 4. PRUEBA DE ACTUALIZACIÓN
        console.log("\n4️⃣ Actualizando el teléfono del candidato...");
        const nuevosDatos = {
            tipo_identificacion: 'RUT',
            numero_identificacion: '12.222.600-9',
            nombre: 'Javiera Belen',
            apellido_paterno: 'Novoa',
            apellido_materno: 'Espejo',
            celular: '+22222222222' // <--- Nuevo número
        };

        const actualizado = await Candidato.actualizarPerfil(idUsuarioCreado, nuevosDatos);

        if (actualizado) {
            console.log("✅ ¡Cambio guardado con éxito!");
            
            // Verificamos el cambio volviendo a pedir el perfil
            const perfilActualizado = await Candidato.obtenerPerfil(idUsuarioCreado);
            console.log("⭐ Perfil con el nuevo teléfono:");
            console.table([perfilActualizado]);
        }


    } catch (error) {
        console.error("❌ Error en la prueba:", error.message);
    } finally {
        console.log("\n--- PRUEBA FINALIZADA ---");
        process.exit();
    }
}

flujoCompletoPerfil();