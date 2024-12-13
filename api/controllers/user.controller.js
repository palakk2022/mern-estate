
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';
export const test = (req,res)=>{
    res.json({
        message:'Api route is working!',
    });
};export const updateuser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(401, "You can only update your own account!"));
    }
  
    try {
      // Prepare updated fields
      const updatedFields = { ...req.body };
  
      // Hash the password only if provided
      if (req.body.password && req.body.password.trim() !== '') {
        updatedFields.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      // Update the user in the database
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updatedFields },
        { new: true }
      );
  
      // Check if user exists
      if (!updatedUser) {
        return next(errorHandler(404, "User not found"));
      }
  
      // Exclude the password from the response
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      console.error("Error updating user:", error);
      next(error);
    }
  };

  
  export const deleteUser = async (req, res, next) => {
    if ( req.user.id !== req.params.id) {
      return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token');
      res.status(200).json('User has been deleted');
    
    } catch (error) {
      next(error);
    }
  };
  
  export const getUserListings = async (req, res, next) => {
    try {
      const { userRef } = req.params;
  
      // Check if the authenticated user's ID matches the userRef
      if (req.user.id === userRef) {
        const listings = await Listing.find({ userRef });
        if (!listings.length) {
          return res.status(404).json({ message: 'No listings found for this user.' });
        }
        return res.status(200).json(listings);
      } else {
        return next(errorHandler(401, 'You can only view your own Listings!'));
      }
    } catch (error) {
      next(error);
    }
  };
  