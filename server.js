const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Database connection

mongoose.connect('mongodb+srv://williams:Vs5sk53xDsZEs1IH@cluster0.btn4gif.mongodb.net/')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Connection Error:', err));

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173/', // Replace with your frontend URL
        credentials: true, // Allow cookies to be sent
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With', 'Accept', 'Pragma', 'Expires'],
    })
)

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});