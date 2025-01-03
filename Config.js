const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === 'true',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT),
    queueLimit: parseInt(process.env.DB_QUEUE_LIMIT),
    timezone: process.env.DB_TIMEZONE,
});

// Test connection and log confirmation with a Promise wrapper
(async () => {
    try {
        
        const connection = await new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {
                if (err) reject(err);
                else resolve(conn);
            });
        });
        console.log('Successfully connected to the database');
         // Release the connection back to the pool
    } catch (err) {
        console.log('Database connection failed:', err);
    }
})();

// Export the pool for use in other parts of your application
module.exports = pool;

