const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');  // Protect middleware for authentication
const { admin } = require('../middleware/adminMiddleware');  // Import the new admin middleware
const {
  getProfile,
  updateProfile,
  changePassword,
  getDashboardData,
  getAllProfiles
} = require('../controllers/userController');

// ✅ Existing Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

// ✅ Protected Route for Admin Only
router.get('/all-profiles', protect, admin, getAllProfiles); // Admin-only access

// ✅ NEW: Dashboard Route
router.get('/dashboard', protect, getDashboardData);

module.exports = router;
