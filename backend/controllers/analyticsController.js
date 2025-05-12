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

exports.getReadingAnalytics = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('readingHistory.book');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const history = user.readingHistory || [];
    const totalBooks = history.length;

    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 6);

    let readingMinutesThisWeek = 0;
    let completed = 0, inProgress = 0, notStarted = 0;
    let totalProgress = 0;

    const weeklyReadingMap = {
      Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0
    };

    for (const entry of history) {
      const progress = entry.progress || 0;
      totalProgress += progress;

      if (progress >= 90) completed++;
      else if (progress > 0) inProgress++;
      else notStarted++;

      if (entry.lastRead && new Date(entry.lastRead) >= oneWeekAgo) {
        const readDate = new Date(entry.lastRead);
        const dayName = readDate.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., Mon
        weeklyReadingMap[dayName] += entry.timeSpent || 0;
        readingMinutesThisWeek += entry.timeSpent || 0;
      }
    }

    const averageProgress = totalBooks > 0 ? Math.round(totalProgress / totalBooks) : 0;

    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyReadingTime = orderedDays.map(day => ({
      day,
      minutes: weeklyReadingMap[day] || 0,
    }));

    res.json({
      totalBooks,
      averageProgress,
      readingMinutesThisWeek,
      statusBreakdown: {
        completed,
        inProgress,
        notStarted
      },
      weeklyReadingTime 
    });
  } catch (err) {
    console.error('❌ Analytics error:', err.message);
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
};
