const express = require('express');
const app = express();
const cors = require('cors'); // Import cors
const bodyParser = require('body-parser');
const mysql = require('mysql');

// Use CORS middleware
app.use(cors());  // This enables CORS for all routes and origins

// Use body-parser to parse JSON request bodies
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'ess_project',
});

db.connect((err) => {
    if (err) {
        console.error('Could not connect to MySQL', err);
    } else {
        console.log('Connected to the MySQL database');
    }
});

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    const query = 'SELECT * FROM Master WHERE mail = ?';
    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (result.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    });
});

// Start the server
app.listen(8081, () => {
    console.log('Server is running on port 8081');
});
