const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth/authRoutes');
const adminProductsRouter = require('./routes/admin/productsRoutes');
const shopProductsRouter = require('./routes/shop/productsRoutes');


require('dotenv').config();

// Database connection

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection Error:', err));

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173', // Replace with your frontend URL
        credentials: true, // Allow cookies to be sent
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Accept', 'Pragma', 'Expires'],
    })
)

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/admin/products', adminProductsRouter);
app.use('/api/shop/products', shopProductsRouter)

const path = require('path');

// Serve frontend
app.use(express.static(path.join(__dirname, 'client/dist'))); // Adjust 'dist' or 'build' depending on your setup

// Fallback for React Router (must be after static middleware)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});