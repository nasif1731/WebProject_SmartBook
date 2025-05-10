const Book = require('../models/Book');
const User = require('../models/User');

// Fetch all books for admin
const getBooksForAdmin = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load books' });
  }
};

// Moderate a book (flag for review/approve)
const moderateBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Flag book as 'not approved' for review
    book.isPublic = false;
    await book.save();
    res.json({ message: 'Book flagged for moderation' });
  } catch (error) {
    res.status(500).json({ message: 'Error moderating book' });
  }
};

// Get all users (admin only)
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Update user role (admin only)
const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body; // Role can be 'client', 'freelancer', or 'admin'

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

module.exports = { getBooksForAdmin, moderateBook, getUsers, updateUserRole };
