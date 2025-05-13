const User = require('../models/User');
const UserBook = require('../models/UserBook');

exports.getLeaderboard = async (req, res) => {
  try {
    
    const completedCounts = await UserBook.aggregate([
      { $match: { readingStatus: 'completed' } },
      {
        $group: {
          _id: '$user',
          completedBooks: { $sum: 1 },
          totalPages: { $sum: { $ifNull: ['$pagesRead', 0] } } 
        }
      },
      { $sort: { completedBooks: -1 } },
      { $limit: 10 }
    ]);

    
    const userIds = completedCounts.map(entry => entry._id);
    const users = await User.find({ _id: { $in: userIds } }).select('fullName avatar createdAt');

   
    const leaderboard = completedCounts.map(entry => {
      const user = users.find(u => u._id.toString() === entry._id.toString());
      return {
        userId: entry._id,
        fullName: user?.fullName || 'User',
        avatar: user?.avatar || '',
        joinedAt: user?.createdAt,
        completedBooks: entry.completedBooks,
        totalPages: entry.totalPages || 0,
      };
    });

    return res.json(leaderboard);
  } catch (err) {
    return res.status(500).json({ message: 'Leaderboard failed', error: err.message });
  }
};
