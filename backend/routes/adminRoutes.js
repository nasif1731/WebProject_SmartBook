const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware'); // Protect and Admin middleware
const {
  getBooksForAdmin,        // Fetch all books for admin
  moderateBook,            // Moderate (flag/approve) a book
  getUsers,                // Fetch all users
  updateUserRole           // Update user role (admin functionality)
} = require('../controllers/adminController');

// Admin routes for managing books
router.get('/books', protect, isAdmin, getBooksForAdmin);       // Fetch all books for admin
router.put('/moderate/:bookId', protect, isAdmin, moderateBook); // Flag/Approve books for moderation
router.get('/stats', protect, isAdmin, getDashboardData); // Ensure this matches in the frontend

// Admin route for managing users
router.get('/users', protect, isAdmin, getUsers);               // Fetch all users
router.put('/users/:userId', protect, isAdmin, updateUserRole); // Update user role

module.exports = router;
