const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  description: String,
  tags: [String],
  genre: String,
  isPublic: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false }, // New flag for approval
  pdfUrl: { type: String, required: true },
  coverImageUrl: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
  readCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  summary: { type: String, default: '' },
});

module.exports = mongoose.model('Book', bookSchema);
