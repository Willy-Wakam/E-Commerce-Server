
const express = require('express');
const { register, login, logout, authMiddleware } = require('../../controllers/auth/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user, success: true });
});

module.exports = router;