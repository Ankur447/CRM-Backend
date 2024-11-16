const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Yash@208',
    database: 'CRM',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z', // Ensure the database uses the correct timezone
});

module.exports = pool;
