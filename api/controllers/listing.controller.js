import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req,res,next)=>{

  try{
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  }catch(error){
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
          return next(errorHandler(404, 'Listing not found!'));
      }

      // Ensure the user is authorized to delete the listing
      if (req.user.id !== listing.userRef.toString()) {
          return next(errorHandler(401, 'You can only delete your own listings'));
      }

      await listing.deleteOne(); // Using instance method for deletion
      res.status(200).json({ success: true, message: 'Listing has been deleted!' });
  } catch (error) {
      next(error); // Pass any unexpected errors to the error handler
  }
};
