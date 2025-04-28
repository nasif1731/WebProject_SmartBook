const User = require('../models/User');
const UserBook = require('../models/UserBook');

exports.getLeaderboard = async (req, res) => {
  try {
    const completedCounts = await UserBook.aggregate([
      { $match: { readingStatus: 'completed' } },
      {
        $group: {
          _id: '$user',
          completedBooks: { $sum: 1 }
        }
      },
      { $sort: { completedBooks: -1 } },
      { $limit: 10 }
    ]);

    const users = await User.find({
      _id: { $in: completedCounts.map(u => u._id) }
    }).select('fullName avatar');

    const leaderboard = completedCounts.map(entry => {
      const user = users.find(u => u._id.toString() === entry._id.toString());
      return {
        userId: entry._id,
        fullName: user?.fullName || 'User',
        avatar: user?.avatar,
        completedBooks: entry.completedBooks
      };
    });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Leaderboard failed', error: err.message });
  }
};
