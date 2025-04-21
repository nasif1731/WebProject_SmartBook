const Book = require('../models/Book');
const Review = require('../models/Review');
const UserBook = require('../models/UserBook');

// 🔍 Smart Search
exports.searchBooks = async (req, res) => {
  const { q, genre, author, tags, isPublic, minRating, status, sortBy = 'createdAt', order = 'desc' } = req.query;
  const query = {};

  if (q) {
    const regex = new RegExp(q, 'i');
    query.$or = [{ title: regex }, { author: regex }, { genre: regex }];
  }

  if (genre) query.genre = genre;
  if (author) query.author = new RegExp(author, 'i');
  if (tags) query.tags = { $in: tags.split(',') };
  if (isPublic !== undefined) query.isPublic = isPublic === 'true';

  try {
    let books = await Book.find(query).sort({ [sortBy]: order === 'asc' ? 1 : -1 });

    // ⭐ Rating Filter
    if (minRating) {
      const filtered = await Promise.all(books.map(async book => {
        const reviews = await Review.find({ book: book._id });
        const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);
        return avg >= parseFloat(minRating) ? book : null;
      }));
      books = filtered.filter(Boolean);
    }

    // 📘 Filter by Reading Status (User-specific)
    if (status && req.user) {
      const userBooks = await UserBook.find({ user: req.user._id, readingStatus: status });
      const matchingIds = userBooks.map(ub => ub.book.toString());
      books = books.filter(book => matchingIds.includes(book._id.toString()));
    }

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// 📈 Top Books
exports.getTopBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPublic: true }).sort({ views: -1 }).limit(10);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get top books' });
  }
};

// 💡 Recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const userBooks = await UserBook.find({ user: req.user._id }).populate('book');
    const genres = [...new Set(userBooks.map(entry => entry.book.genre))];
    const recommended = await Book.find({
      genre: { $in: genres },
      _id: { $nin: userBooks.map(entry => entry.book._id) },
      isPublic: true
    }).limit(5);
    res.json(recommended);
  } catch (err) {
    res.status(500).json({ message: 'Recommendation error', error: err.message });
  }
};

// 🕒 Recently Read
exports.getRecentlyReadBooks = async (req, res) => {
  try {
    const entries = await UserBook.find({ user: req.user._id })
      .sort({ lastReadAt: -1 })
      .limit(5)
      .populate('book');
    res.json(entries.map(entry => entry.book));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recent books', error: err.message });
  }
};
