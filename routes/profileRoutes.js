const express = require ('express');
const router = express.Router();
const verifyToken = require('../middlewares/jwtMiddleware');

// Profile root: Only authenticated users can access
router.get('/profile', verifyToken, async (req, res) =>{
   try {
        const user = await User.findById(req.user.id);
        res.json(user);
     } catch (error) {
    res.status(500).json({ message: 'Server Error'});
   }
});

module.exports = router;
