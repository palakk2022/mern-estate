import express from 'express'
import { createListing , deleteListing,updateListings ,getListing,getlistings} from '../controllers/listing.controller.js';
import { verifyToken } from './verifyUser.js';

const router = express.Router();
router.post('/create' ,verifyToken, createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
router.post('/update/:listingId',verifyToken,updateListings);
router.get('/get/:id', getListing);
router.get('/get',getlistings);
export default router;