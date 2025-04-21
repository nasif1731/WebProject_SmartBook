const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const review = await Review.create({
      user: req.user._id,
      book: req.params.bookId,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId }).populate('user', 'fullName');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};
