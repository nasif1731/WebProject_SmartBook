
const express = require('express');
const router = express.Router();
const { uploadBook, getMyBooks, getPublicBooks, editBook, deleteBook } = require('../controllers/bookController');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

router.post('/upload', protect, upload.single('pdf'), uploadBook);
router.get('/my', protect, getMyBooks);
router.get('/public', getPublicBooks);
router.put('/:bookId', protect, editBook);
router.delete('/:bookId', protect, deleteBook);

module.exports = router;
