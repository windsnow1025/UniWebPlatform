import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const uploadFolder = 'uploads/';

// Ensure the upload directory exists
fs.mkdir(uploadFolder, { recursive: true }, (err) => {
  if (err) throw err;
});

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// File Upload Endpoint
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.sendStatus(400);
  }

  // Generate file access URL
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['host'] || req.get('host');
  const url = `${protocol}://${host}${process.env.BASE_URL}/uploads/${req.file.filename}`;

  return res.status(200).json(url);
});

export default router;