


const express = require('express');
const { register, login } = require('../../controllers/auth/authController');
const router = express.Router();

router.post('/register', register);

module.exports = router;