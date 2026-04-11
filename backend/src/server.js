const sequelize = require('./config/db');

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Servidor y Base de Datos listos en el puerto ${PORT}`);
    });
});