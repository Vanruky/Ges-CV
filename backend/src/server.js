require('dotenv').config();
const app = require('./app');
const db = require('./config/db'); 

const PORT = process.env.PORT || 3000;

//verificar la conexión pre arranque
async function startServer() {
    try {
        await db.query('SELECT 1'); 
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`✅ Conexión a MySQL establecida correctamente`);
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:');
        console.error(error.message);
        process.exit(1); 
    }
}

startServer();