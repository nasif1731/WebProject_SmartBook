// routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addReview, getReviews } = require('../controllers/reviewController');

// ⭐ Add a review to a book (authenticated users only)
router.post('/:bookId/reviews', protect, addReview);

// ⭐ Get all reviews for a specific book
router.get('/:bookId/reviews', getReviews);

module.exports = router;
