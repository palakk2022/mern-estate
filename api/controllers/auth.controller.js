import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    console.log('Request payload:', { username, email, password }); // Debug log

    // Validate inputs
    if (!username || !email || !password) {
      throw errorHandler(400, 'All fields are required');
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw errorHandler(400, 'Email already in use choose some other ');
      }
      if (existingUser.username === username) {
        throw errorHandler(400, 'Username already in use choose anotherone..');
      }
    }

    // Hash password and save user
    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashPassword });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during signup:', error); // Debug log
    next(error); // Delegate error handling to middleware
  }
};
