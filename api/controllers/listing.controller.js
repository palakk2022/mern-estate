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


export const updateListings = async (req, res, next) => {
  try {
    const listingId = req.params.listingId; // Get the listingId from params
    if (!listingId) {
      return res.status(400).json({ success: false, message: 'Listing ID is required' });
    }

    // Update the listing logic here
    const updatedListing = await Listing.findByIdAndUpdate(listingId, req.body, { new: true });
    if (!updatedListing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};



export const getListing = async (req, res, next) => {
  try {
    const listingId = req.params.id; // This should get the listingId from the URL
    //console.log('Listing ID:', listingId); // Log the ID to confirm
    const listing = await Listing.findById(listingId);

    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getlistings = async (req,res,next)=>{


  try{
         const limit = parseInt(req.query.limit) || 9;
         const startIndex = parseInt(req.query.startIndex) || 0;
         let offer = req.query.offer;

         if(offer === undefined || offer === 'false'){
          offer = {$in: [false,true] };
         }
          let furnished = req.query.furnished;

          if(furnished === undefined || furnished === 'false'){
            furnished = {$in: [false,true] };
          }

          let parking = req.query.parking
         if (parking === undefined || parking === 'false'){
          parking = {$in: [false,true] };
         }
        let type = req.query.type
        if (type ===undefined || type === 'all'){
          type = { $in: ['sale','rent']}
      }

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';


    const listings = await Listing.find({
      name:{
        $regex:searchTerm ,$options:'i'},
        offer,
        furnished,
        parking,
        type,

      }).sort({[sort]:order}).limit(limit).skip(startIndex);
      return(res.status(200).json(listings));
           

  }catch(error){
    next(error);
  }
}
