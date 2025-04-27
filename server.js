// Import Packages
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Create the application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

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
