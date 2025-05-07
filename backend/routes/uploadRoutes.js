// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const uploadAvatar = require('../middleware/uploadAvatarMiddleware');

// ✅ Use .single here
router.post('/avatar', uploadAvatar.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.status(200).json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
