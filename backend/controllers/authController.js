const jwt = require('jsonwebtoken');
const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

exports.login = (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM Master WHERE mail = ?';
    db.query(query, [email], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length === 0 || result[0].password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result[0];

        // Generate a JWT token and send it back to the frontend
        const token = jwt.sign({ emp_id: user.emp_id, email: user.mail }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    });
};
