const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleAuth,
  sendOtp,
  verifyOtp,        
  resetPassword    
} = require('../controllers/authController');

// 🔐 Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);

// 🔄 Password Recovery
router.post('/send-otp', sendOtp);         // ✅ Generate + send OTP
router.post('/verify-otp', verifyOtp);     // ✅ Verify OTP and clear it
router.post('/reset-password', resetPassword); // ✅ Final password reset without OTP

module.exports = router;
