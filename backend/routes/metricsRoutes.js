
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { getReadingAnalytics } = require('../controllers/analyticsController');
const { getPopularBooks } = require('../controllers/popularityController');
const { getLeaderboard } = require('../controllers/leaderboardController');

router.get('/analytics', protect, getReadingAnalytics);
router.get('/popular', getPopularBooks);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
