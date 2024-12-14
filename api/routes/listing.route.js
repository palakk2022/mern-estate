import express from 'express'
import { createListing , deleteListing,updateListings } from '../controllers/listing.controller.js';
import { verifyToken } from './verifyUser.js';

const router = express.Router();
router.post('/create' ,verifyToken, createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
router.post('/update/:id',verifyToken,updateListings)
export default router;