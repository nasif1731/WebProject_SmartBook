const Book = require('../models/Book');
const User = require('../models/User');

// 🔍 Search Books
exports.searchBooks = async (req, res) => {
  try {
    const { q, genre, author, tags, sortBy = 'createdAt', order = 'desc' } = req.query;

    const query = { isPublic: true };

    // 🔎 Text search
    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [
        { title: regex },
        { author: regex },
        { genre: regex },
      ];
    }

    // 🎭 Genre filter (if not in q)
    if (genre && !q) {
      query.genre = new RegExp(genre, 'i');
    }

    // ✍️ Author filter
    if (author) {
      query.author = new RegExp(author, 'i');
    }

    // 🏷️ Handle "Popular" and "Recommended" as special tags
    let customSort = null;
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());

      if (tagArray.includes('popular')) {
        // Popular → Sort by views descending
        customSort = { views: -1 };
      }

      if (tagArray.includes('recommended')) {
        // Recommended → Sort by rating descending (if rating field exists)
        customSort = { rating: -1 };
      }
    }

    // 📊 Default sort fallback
    const validSorts = ['createdAt', 'views'];
    const safeSort = validSorts.includes(sortBy) ? sortBy : 'createdAt';
    const sortOption = customSort || { [safeSort]: order === 'asc' ? 1 : -1 };

    const books = await Book.find(query).sort(sortOption);
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
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
