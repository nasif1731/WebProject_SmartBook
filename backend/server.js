require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const bookSearchRoutes = require('./routes/bookSearchRoutes'); 
const reviewRoutes = require('./routes/reviewRoutes');          
const metricsRoutes = require('./routes/metricsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);          
app.use('/api/books', bookSearchRoutes);    
app.use('/api/reviews', reviewRoutes);    
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/metrics', metricsRoutes);

// Root
app.get('/', (req, res) => {
  res.send('📚 SmartBook API is running...');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
