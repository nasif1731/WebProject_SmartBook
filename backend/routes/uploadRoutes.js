// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadAvatarMiddleware'); // shared multer config

// 📤 Avatar upload
router.post('/avatar', (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      console.error('❌ Avatar upload error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('✅ Avatar uploaded:', req.file.filename);
    res.status(200).json({ url: `/uploads/avatars/${req.file.filename}` });
  });
});

// 📚 Book cover upload
router.post('/cover', (req, res, next) => {
  upload.single('cover')(req, res, (err) => {
    if (err) {
      console.error('❌ Cover upload error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('✅ Cover uploaded:', req.file.filename);
    res.status(200).json({ url: `/uploads/covers/${req.file.filename}` });
  });
});

module.exports = router;
