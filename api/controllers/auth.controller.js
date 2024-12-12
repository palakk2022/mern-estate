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
};

export const google = async(req,res,next)=>{

  try{
 const user = await User.findOne({email:req.body.email});
 if(user){
         const token = jwt.sign({ id: user._id} ,process.env.JWT_SECRET);
         const {password:pass,...rest}= user._doc;
         res
         .cookie('access_token',token , {httpOnly:true})
         .status(200)
         .json(rest);
 }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashPassword=  bcryptjs.hashSync(generatedPassword,10);
            const newUser = new User({ username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4)
               , email:req.body.email ,
                password:hashPassword, 
                avatar :req.body.photo});

                await newUser.save();
                const token = jwt.sign({ id: newUser._id} ,process.env.JWT_SECRET); 
                const {password:pass,...rest}= newUser._doc;
                res
                .cookie('access_token',token , {httpOnly:true})
                .status(200)
                .json(rest);
 }
  }catch(error){
     next(error)
  }
}
export const signOut = async(req,res,next)=>{
    
  try{
            res.clearCookie('access_token');
            res.status(200).json('User haas been logged out!');
  }catch(error){
    next(error)
  }
}