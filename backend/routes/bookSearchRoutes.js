const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchBooks,
  getTopBooks,
  getRecommendations,
  getRecentlyReadBooks
} = require('../controllers/bookSearchController');
const {
  addReview,
  getReviews
} = require('../controllers/reviewController');

// 🔍 Smart Search & Filters
router.get('/search', protect, searchBooks);

// 📈 Top Books
router.get('/top', getTopBooks);

// 💡 Recommendations
router.get('/recommendations', protect, getRecommendations);

// 🕒 Recently Read
router.get('/recent', protect, getRecentlyReadBooks);

// ⭐ Reviews
router.post('/:bookId/reviews', protect, addReview);
router.get('/:bookId/reviews', getReviews);

module.exports = router;
