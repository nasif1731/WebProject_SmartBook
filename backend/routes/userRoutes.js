// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/userController');

// ✅ Routes
router.get('/profile', protect, getProfile);            // View Profile
router.put('/profile', protect, updateProfile);         // Edit Profile
router.post('/change-password', protect, changePassword); // Change Password

module.exports = router;

