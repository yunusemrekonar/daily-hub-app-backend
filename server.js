// Import Packages
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Create the application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint for User Creation

app.post('/api/users', async(req, res) => {
    const{ name, email, password } = req.body;

    try{
        const newUser = new User ({
            name,
            email,
            password,
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        res.status(500).json({message: error.message });
    }
});

// An easy test endpoint
app.get('/',(req, res) => {
    res.send('DailyHub Backend is Running!');
});

// Adjust the Port
const PORT = process.env.PORT || 5000;

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
