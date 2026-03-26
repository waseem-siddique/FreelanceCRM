const express = require('express');
const { register, login, getProfile, updateProfile, verifyRegistrationOtp, verifyLoginOtp, resendOtp, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/verify-registration', verifyRegistrationOtp);
router.post('/login', login);
router.post('/verify-login', verifyLoginOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;