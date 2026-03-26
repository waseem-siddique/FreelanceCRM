const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

// Register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Strong password validation
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires
    });

    try {
      await sendEmail({
        email: user.email,
        subject: 'FreelanceCRM - Your OTP Verification Code',
        message: `Welcome to FreelanceCRM!\n\nYour registration verification code is: ${otp}\nThis code will expire in 10 minutes.`
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // We still return success but maybe email failed (in dev without SMTP config)
      return res.status(201).json({ message: 'User created, but failed to send OTP email. Check backend logs.', userId: user._id, requiresOtp: true });
    }

    res.status(201).json({ message: 'OTP sent to email', userId: user._id, email: user.email, requiresOtp: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Registration OTP
const verifyRegistrationOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      // Resend OTP
      const otp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
      try {
        await sendEmail({
          email: user.email,
          subject: 'FreelanceCRM - Registration Verification Code',
          message: `Your verification code is: ${otp}\nThis code will expire in 10 minutes.`
        });
      } catch (e) {
        console.error('Email failed:', e);
      }
      return res.status(403).json({ requiresOtp: true, isRegistration: true, email: user.email, message: 'Please verify your email. A new OTP has been sent.' });
    }

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    if (!user.lastLogin || (Date.now() - new Date(user.lastLogin).getTime() > TWENTY_FOUR_HOURS)) {
      // Require OTP due to 24 hours gap
      const otp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
      try {
        await sendEmail({
          email: user.email,
          subject: 'FreelanceCRM - Login Verification Code',
          message: `We noticed a new login attempt. Your verification code is: ${otp}\nThis code will expire in 10 minutes.`
        });
      } catch (e) {
        console.error('Email failed:', e);
      }
      return res.status(403).json({ requiresOtp: true, isLogin: true, email: user.email, message: 'OTP sent to email due to new login session' });
    }

    // Normal Login
    user.lastLogin = Date.now();
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Login OTP
const verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.lastLogin = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, email, companyName, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (companyName !== undefined) user.companyName = companyName;
    if (phone !== undefined) user.phone = phone;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      companyName: updatedUser.companyName,
      phone: updatedUser.phone,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Resend OTP
const resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Generate new OTP
    const otp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    let subject = 'FreelanceCRM - Verification Code';
    let message = `Your new verification code is: ${otp}\nThis code will expire in 10 minutes.`;

    try {
      await sendEmail({ email: user.email, subject, message });
    } catch (e) {
      console.error('Email failed:', e);
    }
    
    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = '123456'; // Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const subject = 'FreelanceCRM - Password Reset Verification Code';
    const message = `You requested a password reset. Your verification code is: ${otp}\nThis code will expire in 10 minutes.`;

    try {
      await sendEmail({ email: user.email, subject, message });
    } catch (e) {
      console.error('Email failed:', e);
      return res.status(500).json({ message: 'Failed to send reset email. Please try again later.' });
    }

    res.json({ message: 'Password reset OTP sent to email', requiresOtp: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    
    await user.save();

    res.json({ message: 'Password has been successfully reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, verifyRegistrationOtp, verifyLoginOtp, resendOtp, forgotPassword, resetPassword };