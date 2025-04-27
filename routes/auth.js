const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Login
router.post('/login', async (req,res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        return res.status(400).json({ message: 'Invalid credentials'});
    }
    // JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: '1h'});

    // If login is complated successfully, send to user with token
    res.json({ message: 'Login successful', token});
});

module.exports = router;