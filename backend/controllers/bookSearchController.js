const Book = require('../models/Book');
const User = require('../models/User');

// 🔍 Search Books
exports.searchBooks = async (req, res) => {
  try {
    const { q, genre, author, tags, sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = [];

    console.log('📥 Incoming Params:', req.query);

    if (q) {
      const regex = new RegExp(q, 'i');
      query.push({ $or: [{ title: regex }, { author: regex }, { genre: regex }] });
    }

    if (genre) query.push({ genre });
    if (author) query.push({ author: new RegExp(author, 'i') });
    if (tags) query.push({ tags: { $in: tags.split(',') } });

    // Optional: filter public books only
    query.push({ isPublic: true });

    const mongoQuery = query.length > 0 ? { $and: query } : {};

    console.log('🔍 Final Mongo Query:', JSON.stringify(mongoQuery));

    const sortFields = ['createdAt', 'views'];
    const safeSort = sortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOption = { [safeSort]: order === 'asc' ? 1 : -1 };

    const books = await Book.find(mongoQuery).sort(sortOption);

    res.json(books);
  } catch (err) {
    console.error('❌ searchBooks Error:', err.stack || err);
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
};



// 🔄 Recently Read Books
exports.getRecentlyReadBooks = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'readingHistory.book',
        match: { isPublic: true },
      });

    const recentBooks = user.readingHistory
      .sort((a, b) => new Date(b.lastRead) - new Date(a.lastRead))
      .map(entry => entry.book)
      .filter(Boolean);

    res.json(recentBooks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get recently read books', error: err.message });
  }
};

// 🧠 Recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('readList');
    const readGenres = user.readList.map(book => book.genre);

    const books = await Book.find({
      genre: { $in: readGenres },
      _id: { $nin: user.readList.map(book => book._id) },
      isPublic: true,
    }).limit(10);

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get recommendations', error: err.message });
  }
};

// 📈 Top Books
exports.getTopBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPublic: true })
      .sort({ views: -1, createdAt: -1 })
      .limit(10);

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get top books', error: err.message });
  }
};
