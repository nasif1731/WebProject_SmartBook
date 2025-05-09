// File: models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  avatar: {
    type: String,
    default:
      'https://lh3.googleusercontent.com/X8LuYsGddUvyGns8yNt3lsqXU-etopUi9saFCQ-VMIImDW0plr-ZvBRjhnKh4V2r6UEMaBMXUBkJSD_RrHbWdmIp2RUnVJgcbiJ_S3l_kOAseWWI6JiLccLcL0cRFpnba-n4bjlOW3FvHbHdMs_ToZE',
  },
  latitude: { type: Number },     
  longitude: { type: Number },    
  readList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  uploadedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  readingHistory: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
      progress: { type: Number, default: 0 },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  otp: String,
  otpExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
