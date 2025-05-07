const User = require('../models/User');
const Book = require('../models/Book');
const bcrypt = require('bcryptjs');

// 🔐 Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -isAdmin')
      .populate('readList uploadedBooks');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// ✏️ Profile Update
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, avatar, preferences, latitude, longitude } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (avatar) user.avatar = avatar;
    if (preferences) user.preferences = preferences;
    if (latitude) user.latitude = latitude;
    if (longitude) user.longitude = longitude;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

// 🔑 Password Change
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change password', error: err.message });
  }
};

// 📊 Dashboard Data 
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const uploads = await Book.find({ uploadedBy: userId }).sort({ createdAt: -1 });

    const user = await User.findById(userId)
      .populate('readList')
      .populate({
        path: 'readingHistory.book',
        match: { isPublic: true },
      });

    const readList = user?.readList || [];
    const readingHistoryBooks = (user?.readingHistory || [])
      .map(entry => entry.book)
      .filter(book => book); // filter out nulls

    // Merge unique books from both readList and readingHistory
    const allReadBooksMap = new Map();
    [...readList, ...readingHistoryBooks].forEach(book => {
      if (book && !allReadBooksMap.has(book._id.toString())) {
        allReadBooksMap.set(book._id.toString(), book);
      }
    });

    const mergedReadBooks = Array.from(allReadBooksMap.values());

    res.json({ uploads, readList: mergedReadBooks });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error: err.message });
  }
};
