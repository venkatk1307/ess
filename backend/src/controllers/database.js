// backend/src/database.js
import mysql from 'mysql2';
import dbConfig from '../config/dbConfig.js';

const pool = mysql.createPool({
    connectionLimit: 10,
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    waitForConnections: true,
    connectTimeout: 30000 // Adjust timeout as needed
});

// Ping the database every minute to keep connections alive
setInterval(() => {
    pool.query('SELECT 1', (err) => {
        if (err) {
            console.error('Ping error:', err);
        }
    });
}, 60000);

export default pool;