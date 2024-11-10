const express = require('express');
const XLSX = require('xlsx');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

function readExcelFile() {
    const workbook = XLSX.readFile(path.join('D:', 'Login_details.xlsx'));
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json(sheet);
}

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const loginData = readExcelFile();

    // console.log('Login attempt:', email, password);
    // console.log('Available credentials:', loginData);

    const user = loginData.find(user =>
        user.Email.trim().toLowerCase() === email.trim().toLowerCase() &&
        user.Password.trim() === password.trim()
    );

    if (user) {
        console.log('Login successful for:', email);
        res.json({ success: true, message: 'Login successful' });
    } else {
        console.log('Login failed for:', email);
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});