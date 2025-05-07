const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleAuth,
  sendOtp,
  verifyOtp,
  resetPassword,
} = require('../controllers/authController');

// 📝 Registration & Login
router.post('/register', registerUser);        // New user registration (with geolocation + CAPTCHA)
router.post('/login', loginUser);              // Email/password login with CAPTCHA
router.post('/google', googleAuth);            // Google OAuth login

// 🔐 Password Recovery Flow
router.post('/send-otp', sendOtp);             // Send OTP to user's email
router.post('/verify-otp', verifyOtp);         // Verify OTP
router.post('/reset-password', resetPassword); // Reset password after OTP verification

module.exports = router;
