const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },

  readingStatus: {
    type: String,
    enum: ['not-started', 'in-progress', 'completed'],
    default: 'not-started'
  },

  progress:    { type: Number, default: 0 }, 
  lastReadAt:  { type: Date, default: Date.now }
}, { timestamps: true });

userBookSchema.index({ user: 1, book: 1 }, { unique: true }); 

module.exports = mongoose.model('UserBook', userBookSchema);