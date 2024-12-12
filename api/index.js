import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import multer from 'multer';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs'; // Import fs module to delete files
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';  // Import CORS middleware
import { handleErrors } from './utils/handleErrors.js'; // Import global error handler

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend origin
}));

// Middleware setup
app.use(express.json()); // For parsing JSON request bodies
app.use(cookieParser()); // For parsing cookies

// Get __dirname equivalent in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Static folder for serving uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max size: 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// File upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded!',
    });
  }
  res.status(200).json({
    success: true,
    message: 'File uploaded successfully!',
    filePath: `/uploads/${req.file.filename}`, // Ensure this is the correct path to the uploaded file

  });
});




// DELETE route for file deletion
app.delete('/api/delete-file', (req, res) => {
  const { filePath } = req.body;

  // Ensure the filePath is provided
  if (!filePath) {
    return res.status(400).json({
      success: false,
      message: 'File path is required',
    });
  }

  // Get the directory name of the current file (index.js)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // Construct the correct path to the 'uploads' folder in the root directory
  const fileToDelete = path.join(__dirname, '..', 'uploads', path.basename(filePath));

  // Try to delete the file
  fs.unlink(fileToDelete, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting file',
        error: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File deleted successfully',
    });
  });
});

// Route handling
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

// Global error handling middleware
app.use(handleErrors);

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
