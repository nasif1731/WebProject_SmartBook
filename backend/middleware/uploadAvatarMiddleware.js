const multer = require('multer');
const path = require('path');

// Set up storage location and filename pattern
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`),
});

// Only allow jpg, jpeg, and png files
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

// Export multer instance (not .single)
const upload = multer({ storage, fileFilter });

module.exports = upload;
