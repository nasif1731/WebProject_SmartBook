const Book = require('../models/Book');

exports.getPopularBooks = async (req, res) => {
  const { metric = 'views', limit = 10 } = req.query;
  const allowedMetrics = ['views', 'readCount', 'averageRating'];

  if (!allowedMetrics.includes(metric)) {
    return res.status(400).json({ message: `Invalid metric: ${metric}` });
  }

  try {
    const books = await Book.find({ isPublic: true })
      .sort({ [metric]: -1 })
      .limit(parseInt(limit));
      
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch popular books', error: err.message });
  }
};
