const express = require('express');
const router = express.Router();
const {
  uploadBook,
  getMyBooks,
  getPublicBooks,
  getBookById,
  editBook,
  deleteBook,
  getRecentlyReadBooks,
  getRecommendations,
  getTopBooks,
  recordReading,
  getAllBooks
} = require('../controllers/bookController');
const { addReview, getReviews } = require('../controllers/reviewController');
const { admin  } = require('../middleware/adminMiddleware'); // Adjust path if needed
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// 📚 Book routes
router.post('/upload', protect, upload.single('pdf'), uploadBook);
router.get('/my', protect, getMyBooks);
router.get('/public', getPublicBooks);
router.get('/all', protect, admin , getAllBooks); // Ensure isAdmin is used properly

router.get('/top', getTopBooks);
router.get('/recommendations', protect, getRecommendations);
router.get('/recent', protect, getRecentlyReadBooks);

router.get('/:bookId', protect, getBookById);
router.put('/:bookId', protect, editBook);
router.delete('/:bookId', protect, deleteBook);
router.post('/read/:bookId', protect, recordReading);

// ⭐ Review routes
router.post('/:bookId/reviews', protect, addReview);
router.get('/:bookId/reviews', getReviews);

module.exports = router;
