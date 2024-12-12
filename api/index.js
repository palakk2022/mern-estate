import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import { handleErrors } from './utils/handleErrors.js';  // Import the global error handler

dotenv.config();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Error connecting to the database", err);
  });

const app = express();

// Middleware setup
app.use(express.json()); // For parsing JSON request bodies
app.use(cookieParser()); // For parsing cookies

// Route handling
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

// Add the global error handler at the end of all routes
app.use(handleErrors);  // This middleware will catch any errors from previous middlewares

// Default error handler (generic)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Start the server
app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
