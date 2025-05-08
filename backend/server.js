require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// 🔌 Connect to MongoDB
connectDB();

// 🔧 Initialize Express App
const app = express();

// 🔐 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 📂 Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📦 Import Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const bookSearchRoutes = require('./routes/bookSearchRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const otpRoutes = require('./routes/otpRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// 🔗 Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);          // CRUD, upload, etc.
app.use('/api/books', bookSearchRoutes);    // search, top, recent, recommendations
app.use('/api/reviews', reviewRoutes);
app.use('/api/user', userRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/upload', uploadRoutes);       // avatar upload

// 🏠 Root Endpoint
app.get('/', (req, res) => {
  res.send('📚 SmartBook API is running...');
});

// 🚀 Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
