const express = require('express');
const { loginUser, registerUser } = require('../controllers/authController');
const router = express.Router();

// --- Student Routes ---
router.post('/student/register', registerUser('student'));
router.post('/student/login', loginUser);

// --- Warden Routes ---
router.post('/warden/register', registerUser('warden'));
router.post('/warden/login', loginUser);

module.exports = router;