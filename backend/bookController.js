const Book = require('../models/Book');

exports.uploadBook = async (req, res) => {
  try {
    const { title, author, description, tags, isPublic, coverImageUrl } = req.body;
    const pdfUrl = req.file?.path;

    const book = await Book.create({
      title,
      author,
      description,
      tags: tags?.split(',') || [],
      isPublic,
      pdfUrl,
      coverImageUrl,
      uploadedBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (err) {
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
  if (!book.uploadedBy.equals(req.user._id) && !req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized' });

  await book.deleteOne();
  res.json({ message: 'Book deleted' });
};


