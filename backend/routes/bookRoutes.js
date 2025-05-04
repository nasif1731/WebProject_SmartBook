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
} = require('../controllers/bookController');


const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');


router.post('/upload', protect, upload.single('pdf'), uploadBook);
router.get('/my', protect, getMyBooks);
router.get('/public', getPublicBooks);


router.get('/top', getTopBooks);
router.get('/recommendations', protect, getRecommendations);
router.get('/recent', protect, getRecentlyReadBooks);

router.get('/:bookId', protect, getBookById); // ⬅️ Keep last among GET routes
router.put('/:bookId', protect, editBook);
router.delete('/:bookId', protect, deleteBook);
router.post('/read/:bookId', protect, recordReading);

module.exports = router;
