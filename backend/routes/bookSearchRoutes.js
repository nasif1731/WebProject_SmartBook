const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  searchBooks,
  getTopBooks,
  getRecommendations,
  getRecentlyReadBooks
} = require('../controllers/bookSearchController');

// 🔍 Search
router.get('/search', searchBooks);

// 📈 Top, 💡 Recommendations, 🔄 Recent
router.get('/top', getTopBooks);
router.get('/recommendations', protect, getRecommendations);
router.get('/recent', protect, getRecentlyReadBooks);

module.exports = router;
