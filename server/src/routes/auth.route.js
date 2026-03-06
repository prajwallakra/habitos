const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/logout', (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    });
    res.status(200).json({message: 'Logout successful'})
})

router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({authenticated: true,user: req.user})
})

router.get('/dashboard', authMiddleware, (req, res) => {
    res.status(200).json({message: 'Welcome to the dashboard', user: req.user})
})

module.exports = router;