const mysql = require('mysql2/promise');

// Create a connection pool
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

// Test connection and log confirmation
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Database connection failed:', err);
    }
})();

// Export the pool for use in other parts of your application
module.exports = pool;
