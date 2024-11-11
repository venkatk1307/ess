// config/db.js

const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Could not connect to MySQL', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

module.exports = db;
