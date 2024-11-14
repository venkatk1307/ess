// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/leave', leaveRequestRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
