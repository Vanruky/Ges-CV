const mysql = require('mysql2')
require('dotenv').config();

const pool =mysql.createPool({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:10,
    queueLimit: 0 

});
//esto es para que erconozca el async y await
const promisePool = pool.promise();

//esto es para que la promesa se pueda usar en los modelos 
module.exports = promisePool;