// Import Packages
const express = require('express');
const cors = require('cors');
const User = require('./models/User');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');

require('dotenv').config();


// Create the application
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

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
