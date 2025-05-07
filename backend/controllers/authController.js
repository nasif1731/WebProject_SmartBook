const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// 👇 node-fetch dynamic import to avoid ESM error
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 🔐 Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ✅ reCAPTCHA Verification
const verifyCaptcha = async (token) => {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`,
  });
  return await response.json();
};

// 📝 Register
exports.registerUser = async (req, res) => {
  console.log("📝 Register payload:", req.body); // DEBU
  const { fullName, email, password, latitude, longitude, captchaToken } = req.body;

  const captchaRes = await verifyCaptcha(captchaToken);
  console.log("✅ CAPTCHA result (Register):", captchaRes); // DEBUG
  if (!captchaRes.success) {
    return res.status(400).json({ message: 'CAPTCHA verification failed' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      fullName,
      email,
      password,
      latitude,
      longitude,
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// 🔑 Login
exports.loginUser = async (req, res) => {
  console.log("📝 login payload:", req.body); // DEBU
  const { email, password, captchaToken } = req.body;

  const captchaRes = await verifyCaptcha(captchaToken);
  console.log("✅ CAPTCHA result (Login):", captchaRes); // DEBUG
  if (!captchaRes.success) {
    return res.status(400).json({ message: 'CAPTCHA verification failed' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};

// 🔐 Google Sign-In
exports.googleAuth = async (req, res) => {
  const { name, email, picture } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        password: 'google-oauth',
        avatar: picture || undefined,
      });
    }

    const token = generateToken(user._id);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    res.status(500).json({ message: 'Google login failed', error: err.message });
  }
};

// 📩 Send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with this email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    try {
      await sendEmail(email, 'SmartBook OTP', `<h3>Your OTP is: ${otp}</h3>`);
    } catch (emailErr) {
      console.error("❌ Email sending failed:", emailErr.message);
      return res.status(500).json({ message: 'Failed to send email', error: emailErr.message });
    }

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error("❌ OTP Error:", err.message);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};

// 🔁 Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    return res.status(500).json({ message: 'Password reset failed', error: err.message });
  }
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    return res.status(400).json({ message: 'Email and OTP required' });
  }

  try {
    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetOTP !== otpCode ||
      !user.resetOTPExpires ||
      user.resetOTPExpires < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'OTP verified' });
  } catch (err) {
    return res.status(500).json({ message: 'OTP verification failed', error: err.message });
  }
};
