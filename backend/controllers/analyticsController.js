const UserBook = require('../models/UserBook');

exports.getReadingAnalytics = async (req, res) => {
  try {
    const userBooks = await UserBook.find({ user: req.user._id });

    const statusCount = { 'not-started': 0, 'in-progress': 0, 'completed': 0 };
    let totalProgress = 0;

    userBooks.forEach(entry => {
      statusCount[entry.readingStatus]++;
      totalProgress += entry.progress || 0;
    });

    const averageProgress = userBooks.length ? (totalProgress / userBooks.length).toFixed(2) : 0;

    res.json({
      totalBooks: userBooks.length,
      statusBreakdown: statusCount,
      averageProgress: Number(averageProgress)
    });
  } catch (err) {
    res.status(500).json({ message: 'Analytics failed', error: err.message });
  }
};
