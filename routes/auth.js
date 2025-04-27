const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Joi = require('joi');
const router = express.Router();

// JWT Token doğrulama (verifyToken) Middleware
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization'); // Authorization başlığından token'ı al
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Kullanıcıyı request objesine ekle
        next(); // Devam et
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

// Login Validation Schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { error } = loginSchema.validate(req.body); // Validation ekleyelim
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
});

// Profile Update Route
router.put('/profile', verifyToken, async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user.id; // Token'dan kullanıcı ID'sini al

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
