const express = require ('express');
const router = express.Router();
const verifyToken = require('../middlewares/jwtMiddleware');

// Profile root: Only authenticated users can access
router.get('/profile', verifyToken, (req, res) =>{
    res.status(200).json({
        message: 'User profile',
        user: req.user,
    });
});

module.exports = router;
