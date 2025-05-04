const Book = require('../models/Book');
const Review = require('../models/Review');
const UserBook = require('../models/UserBook');

exports.searchBooks = async (req, res) => {
  try {
    console.log('🔍 Incoming query:', req.query);
    console.log('🔍 Search route hit:', req.query);

    const {
      q, genre, author, tags, isPublic, minRating, status,
      sortBy = 'createdAt', order = 'desc'
    } = req.query;

    const query = {};

    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [{ title: regex }, { author: regex }, { genre: regex }];
    }

    if (genre) query.genre = genre;
    if (author) query.author = new RegExp(author, 'i');
    if (tags) query.tags = { $in: tags.split(',') };
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';

    // 🧪 Safe fallback sort field
    const validSortFields = ['createdAt', 'views'];
    const safeSortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';

    let books = await Book.find(query).sort({ [safeSortField]: order === 'asc' ? 1 : -1 });

    res.json(books);
  } catch (err) {
    console.error('❌ SearchBooks Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
};
