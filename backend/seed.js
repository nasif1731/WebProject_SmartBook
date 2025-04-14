require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const seedData = async () => {
  await connectDB();

  try {
    // Clear old data
    await User.deleteMany();
    await Book.deleteMany();

    // Create user
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = await User.create({
      fullName: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword,
      isAdmin: true
    });

    // Create book
    await Book.create({
        title: "Timeless Seeds of Advice",
        author: "B. B. Abdulla",
        description: "Sayings of the Prophet ﷺ, Ibn Taymiyyah, Ibn al-Qayyim and other scholars—compiled to bring comfort and hope to the soul.",
        tags: ["Islam", "spirituality", "wisdom", "hadith"],
        isPublic: true,
        pdfUrl: "uploads/Timeless Seeds of Advice.pdf",
        coverImageUrl: "uploads/timeless_seeds_cover.png",
        uploadedBy: user._id, 
        createdAt: new Date()
      });

    console.log('Seed data inserted successfully!');
    process.exit();
  } catch (err) {
    console.error('Error inserting seed data:', err);
    process.exit(1);
  }
};

seedData();
