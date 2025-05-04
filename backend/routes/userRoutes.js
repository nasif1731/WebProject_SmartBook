const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  changePassword,
  getDashboardData // ✅ new controller
} = require('../controllers/userController');

// ✅ Existing Routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

// ✅ NEW: Dashboard Route
router.get('/dashboard', protect, getDashboardData);

module.exports = router;
