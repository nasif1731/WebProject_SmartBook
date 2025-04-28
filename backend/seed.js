require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Book = require('./models/Book');
const Review = require('./models/Review');
const UserBook = require('./models/UserBook');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Failed:', err.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Book.deleteMany();
    await Review.deleteMany();
    await UserBook.deleteMany();

    // 👤 Create Users
    const password = '$2b$10$wr/WTz6aX39uUV22osoaLOuQ2Hx8qP1OOrzU95mODWHFTds97DKqe';
    const admin = await User.create({ fullName: 'Admin User', email: 'admin@example.com', password, isAdmin: true });
    const user = await User.create({ fullName: 'Regular User', email: 'user@example.com', password });

    // 📚 Create Books
    const books = await Book.insertMany([
      {
        title: 'AI for Beginners',
        author: 'John Doe',
        description: 'Intro to AI.',
        genre: 'AI',
        tags: ['AI', 'tech'],
        isPublic: true,
        pdfUrl: '/uploads/ai.pdf',
        coverImageUrl: 'https://via.placeholder.com/150',
        uploadedBy: admin._id,
        views: 100,
        readCount: 60,
        averageRating: 4.5,
        ratingCount: 2
      },
      {
        title: 'Machine Learning Advanced',
        author: 'Jane Smith',
        description: 'Deep dive into ML.',
        genre: 'AI',
        tags: ['ML', 'data'],
        isPublic: true,
        pdfUrl: '/uploads/ml.pdf',
        coverImageUrl: 'https://via.placeholder.com/150',
        uploadedBy: user._id,
        views: 150,
        readCount: 90,
        averageRating: 4.8,
        ratingCount: 3
      }
    ]);

    // 🧠 UserBook Relations
    await UserBook.create([
      { user: user._id, book: books[0]._id, readingStatus: 'completed', progress: 100 },
      { user: user._id, book: books[1]._id, readingStatus: 'in-progress', progress: 45 }
    ]);

    // ⭐ Add Reviews
    await Review.create([
      { user: user._id, book: books[0]._id, rating: 5, comment: 'Great intro!' },
      { user: user._id, book: books[1]._id, rating: 4.5, comment: 'Very insightful.' }
    ]);

    console.log('🌱 Seeding completed!');
    process.exit();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
