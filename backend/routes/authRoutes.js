const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
} = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth); // ✅ Google login route

module.exports = router;
