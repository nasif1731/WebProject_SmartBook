const Book = require('../models/Book');
const User = require('../models/User');

exports.uploadBook = async (req, res) => {
  console.log("📥 UploadBook route triggered");

  try {
    if (!req.body || !req.file) {
      console.log("❌ req.body:", req.body);
      console.log("❌ req.file:", req.file);
      return res.status(400).json({ message: "Missing book data or PDF file" });
    }

    const { title, author, description, tags, isPublic, coverImageUrl, genre } = req.body;
    const pdfUrl = req.file.path;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      tags: tags?.split(',') || [],
      isPublic,
      coverImageUrl,
      pdfUrl,
      uploadedBy: req.user._id,
    });

    // ✅ Also push to user's uploadedBooks array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { uploadedBooks: book._id },
    });

    console.log("✅ Book created:", book.title);
    res.status(201).json(book);
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.getMyBooks = async (req, res) => {
  const books = await Book.find({ uploadedBy: req.user._id });
  res.json(books);
};

exports.getPublicBooks = async (req, res) => {
  const books = await Book.find({ isPublic: true });
  res.json(books);
};

exports.editBook = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.uploadedBy.equals(req.user._id)) return res.status(403).json({ message: 'Unauthorized' });

  Object.assign(book, req.body);
  await book.save();
  res.json(book);
};

exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  // ✅ Remove book ID from user's uploadedBooks
  if (book.uploadedBy) {
    await User.findByIdAndUpdate(book.uploadedBy, {
      $pull: { uploadedBooks: book._id }
    });
  }

  if (!book.uploadedBy.equals(req.user._id) && !req.user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await book.deleteOne();
  res.json({ message: 'Book deleted' });
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
};

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

exports.getTopBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPublic: true })
      .sort({ views: -1 })
      .limit(10);

    console.log('📘 Top books query result:', books);
    res.json(books);
  } catch (err) {
    console.error('❌ Top Books Error:', err.message);
    res.status(500).json({ message: 'Failed to get top books', error: err.message });
  }
};

exports.recordReading = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    const { progress = 0 } = req.body;

    // ✅ Validate book existence
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // ✅ Use findOneAndUpdate with $set and $pullPush logic to avoid document overwrite errors
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove old readingHistory entry if it exists
    user.readingHistory = user.readingHistory.filter(
      (entry) => entry.book.toString() !== bookId
    );

    // Add new one at the top
    user.readingHistory.unshift({
      book: bookId,
      progress,
      lastRead: new Date(),
    });

    // Limit to 20 entries
    if (user.readingHistory.length > 20) {
      user.readingHistory = user.readingHistory.slice(0, 20);
    }

    // Add to readList if not already there
    if (!user.readList.includes(bookId)) {
      user.readList.push(bookId);
    }

    await user.save(); // ✅ Critical save wrapped in full-check above

    // Increment views and readCount safely
    await Book.findByIdAndUpdate(bookId, {
      $inc: { readCount: 1, views: 1 }
    });

    res.status(200).json({ message: 'Reading progress recorded' });
  } catch (err) {
   
    res.status(500).json({ message: 'Failed to track reading', error: err.message });
  }
};
exports.getPublicBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPublic: true }).select('title author genre views ratingCount');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch public books', error: err.message });
  }
};
