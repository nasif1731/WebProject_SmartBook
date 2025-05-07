const Book = require('../models/Book');
const User = require('../models/User');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// 🔍 Extract text from uploaded PDF
const extractTextFromPDF = async (pdfPath) => {
  const buffer = fs.readFileSync(pdfPath);
  const data = await pdf(buffer);
  return data.text;
};

const generateSummary = async (text) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `Summarize the following book content:\n\n${text.slice(0, 2000)}` }
            ]
          }
        ]
      }),
    });

    const data = await response.json();

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    return 'Summary generation failed.';
  } catch {
    return 'Summary generation failed.';
  }
};

// 📥 Upload Book Controller
exports.uploadBook = async (req, res) => {
  try {
    if (!req.body || !req.file) {
      return res.status(400).json({ message: "Missing book data or PDF file" });
    }

    const { title, author, description, tags, isPublic, coverImageUrl, genre } = req.body;
    const pdfUrl = req.file.path;
    const pdfPath = path.join(__dirname, '..', req.file.path);

    const pdfText = await extractTextFromPDF(pdfPath);
    const summary = pdfText
      ? await generateSummary(pdfText)
      : 'No readable text found in PDF to summarize.';

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
      summary,
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { uploadedBooks: book._id },
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// 📚 Get my uploaded books
exports.getMyBooks = async (req, res) => {
  const books = await Book.find({ uploadedBy: req.user._id });
  res.json(books);
};

// 🌍 Get all public books
exports.getPublicBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPublic: true }).select('title author genre views ratingCount');
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch public books', error: err.message });
  }
};

// ✏️ Edit a book
exports.editBook = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.uploadedBy.equals(req.user._id)) return res.status(403).json({ message: 'Unauthorized' });

  Object.assign(book, req.body);
  await book.save();
  res.json(book);
};

// 🗑️ Delete a book
exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });

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

// 📖 Get book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch book', error: err.message });
  }
};

// 🔄 Recently read books
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

// 🧠 Book recommendations
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
      .sort({ views: -1, createdAt: -1 }) // fallback sort to include recent books with 0 views
      .limit(10);

    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get top books', error: err.message });
  }
};


// 📊 Record reading progress
exports.recordReading = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookId = req.params.bookId;
    const { progress = 0 } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.readingHistory = user.readingHistory.filter(
      (entry) => entry.book.toString() !== bookId
    );

    user.readingHistory.unshift({
      book: bookId,
      progress,
      lastRead: new Date(),
    });

    if (user.readingHistory.length > 20) {
      user.readingHistory = user.readingHistory.slice(0, 20);
    }

    if (!user.readList.includes(bookId)) {
      user.readList.push(bookId);
    }

    await user.save();

    await Book.findByIdAndUpdate(bookId, {
      $inc: { readCount: 1, views: 1 }
    });

    res.status(200).json({ message: 'Reading progress recorded' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to track reading', error: err.message });
  }
};
