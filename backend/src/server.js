require('dotenv').config();
const app = require('./app');
const db = require('./config/db'); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(` Servidor corriendo en puerto ${PORT}`);
    console.log(` Base de datos conectada con SQL`);
});