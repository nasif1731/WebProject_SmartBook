const User = require('../models/User');

exports.getReadingAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('readingHistory.book');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const history = user.readingHistory || [];

    const totalBooks = history.length;

    // Fallback progress if missing (assume 0%)
    const progressValues = history.map(entry => entry.progress || 0);
    const sumProgress = progressValues.reduce((acc, val) => acc + val, 0);
    const averageProgress = totalBooks > 0 ? Math.round(sumProgress / totalBooks) : 0;

    // Count reading status
    const statusBreakdown = {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    };

    history.forEach(entry => {
      const progress = entry.progress || 0;
      if (progress >= 90) statusBreakdown.completed++;
      else if (progress > 0) statusBreakdown.inProgress++;
      else statusBreakdown.notStarted++;
    });

    res.json({
      totalBooks,
      averageProgress,
      statusBreakdown,
    });
  } catch (err) {
    console.error('❌ Failed to compute analytics:', err.message);
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};
