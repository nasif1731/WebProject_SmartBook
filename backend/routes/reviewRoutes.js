
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  addReview,
  getReviews
} = require('../controllers/reviewController');


router.post('/:bookId/reviews', protect, addReview);


router.get('/:bookId/reviews', getReviews);

module.exports = router;
