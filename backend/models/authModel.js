// models/authModel.js

const db = require('../config/db');

const findUserByEmail = (email, callback) => {
    const query = 'SELECT * FROM Master WHERE mail = ?';
    db.query(query, [email], callback);
};

module.exports = { findUserByEmail };
