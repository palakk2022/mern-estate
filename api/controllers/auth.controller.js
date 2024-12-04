import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt  from 'jsonwebtoken';

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



export const signin = async (req,res,next) => {
  const {email,password} = req.body;

  try{
         const validuser = await User.findOne({email :email });
         console.log(validuser)
         if(!validuser) return next(errorHandler(404,'user not found!' ));
         const validPassword = bcryptjs.compareSync(password,validuser.password);
         if(!validPassword) return next(errorHandler(401 , 'wrong creadentials!'));

        const token = jwt.sign({id:validuser._id},process.env.JWT_SECRET)
        const{password : pass, ...rest} = validuser._doc;
        res.cookie('access_token',token,{httpOnly :true})
        .status(200)
        .json({ success: true, message: 'Login successful', user :rest });


  }catch(error){
    next(error);
  }
}