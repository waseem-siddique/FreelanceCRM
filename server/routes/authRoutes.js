const express = require('express');
const { register, login, getProfile, updateProfile, verifyRegistrationOtp, verifyLoginOtp, resendOtp } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/verify-registration', verifyRegistrationOtp);
router.post('/login', login);
router.post('/verify-login', verifyLoginOtp);
router.post('/resend-otp', resendOtp);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;