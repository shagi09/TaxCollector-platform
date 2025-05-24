 const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadPath = path.join(__dirname, 'uploads/receipts');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the upload directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + file.fieldname + ext);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.pdf'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error('Only images and PDFs are allowed'), false);
    }
    cb(null, true);
  }
});

module.exports = upload;
