const Review = require('../models/Review');
const Book = require('../models/Book');

// ✅ Add Review and Update Book Rating
exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const bookId = req.params.bookId;

  try {
    // Create the new review
    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment,
    });

    // Recalculate all reviews
    const reviews = await Review.find({ book: bookId });

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = parseFloat((totalRating / reviews.length).toFixed(1));
    const ratingCount = reviews.length;

    // ✅ Update book with new stats
    await Book.findByIdAndUpdate(
      bookId,
      { averageRating, ratingCount },
      { new: true, runValidators: true }
    );

    // ✅ Populate user details for response
    const populatedReview = await review.populate('user', 'fullName avatar');

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error('❌ Failed to add review:', err.message);
    res.status(500).json({ message: 'Failed to add review', error: err.message });
  }
};

// ✅ Get All Reviews for a Book
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'fullName avatar')  // Add avatar if needed
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('❌ Failed to fetch reviews:', err.message);
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};
