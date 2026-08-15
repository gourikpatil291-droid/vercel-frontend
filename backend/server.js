const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Await DB connection middleware for Vercel Serverless
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Middleware DB Error:', err);
        res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
});

app.get('/', (req, res) => {
    res.status(200).send('Service Management API is running live!');
});

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/users', userRoutes);

if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
