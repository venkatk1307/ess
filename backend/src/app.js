import express from 'express';
import authRoutes from './routes/authRoutes.js'; // Ensure the path is correct
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.json());
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
