import dotenv from 'dotenv';
dotenv.config();

// config/dbConfig.js
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306
};


// Default export
export default dbConfig;