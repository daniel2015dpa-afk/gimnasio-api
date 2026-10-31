require('dotenv').config();
const mysql = require('mysql2');

// Pool de conexiones: reutiliza conexiones en vez de abrir una por consulta.
// connectionLimit bajo porque el plan gratuito de Clever Cloud permite pocas conexiones simultáneas.
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    connectionLimit: 3,
    charset: 'utf8mb4',
    dateStrings: true // las fechas llegan como 'AAAA-MM-DD' y no como objetos Date con zona horaria
});

// Prueba la conexión al arrancar
db.getConnection((err, connection) => {
    if (err) {
        console.error('Error de conexión a MySQL:', err.message);
        return;
    }
    console.log('Conexión MySQL exitosa');
    connection.release();
});

module.exports = db;
