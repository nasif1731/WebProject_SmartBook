// backend/middleware/uploadAvatarMiddleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAvatar = req.originalUrl.includes('avatar');
    const folder = isAvatar ? 'uploads/avatars/' : 'uploads/covers/';
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const prefix = req.originalUrl.includes('avatar') ? 'avatar' : 'cover';
    cb(null, `${prefix}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, or PNG images are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
