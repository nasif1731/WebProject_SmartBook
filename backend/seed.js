require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const User = require('./models/User');
const Book = require('./models/Book');
const UserBook = require('./models/UserBook');

const seedData = async () => {
  await connectDB();

  try {
    // Clear old data
    await User.deleteMany();
    await Book.deleteMany();
    await UserBook.deleteMany();

    // Create user
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = await User.create({
      fullName: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
      isAdmin: true,
      avatar: "uploads/default-avatar.png" 
    });

    // Create books
    const book1 = await Book.create({
      title: "Timeless Seeds of Advice",
      author: "B. B. Abdulla",
      description: "Sayings of the Prophet ﷺ, Ibn Taymiyyah, Ibn al-Qayyim and other scholars—compiled to bring comfort and hope to the soul.",
      tags: ["Islam", "spirituality", "wisdom", "hadith"],
      isPublic: true,
      views: 120, 
      readCount: 80, 
      averageRating: 4.5, 
      pdfUrl: "uploads/Timeless Seeds of Advice.pdf",
      coverImageUrl: "uploads/timeless_seeds_cover.png",
      uploadedBy: user._id,
      createdAt: new Date()
    });

    const book2 = await Book.create({
      title: "Patience and Gratitude",
      author: "Ibn Qayyim",
      description: "An Islamic treatise on patience and thankfulness as pillars of faith.",
      tags: ["Islam", "patience", "gratitude"],
      isPublic: true,
      views: 90,
      readCount: 60,
      averageRating: 4.2,
      pdfUrl: "uploads/patience_gratitude.pdf",
      coverImageUrl: "uploads/patience_gratitude_cover.png",
      uploadedBy: user._id,
      createdAt: new Date()
    });

    // Create UserBook entries (for reading analytics and leaderboard)
    await UserBook.create([
      {
        user: user._id,
        book: book1._id,
        readingStatus: 'completed', 
        progress: 100
      },
      {
        user: user._id,
        book: book2._id,
        readingStatus: 'in-progress',
        progress: 50
      }
    ]);

    console.log('Seed data inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('Error inserting seed data:', err);
    process.exit(1);
  }
};

seedData();
