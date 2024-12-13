import express from 'express';
import { test,updateuser,deleteUser,getUserListings } from '../controllers/user.controller.js';
import { verifyToken } from '../routes/verifyUser.js';
const router = express.Router();

router.get('/test',test);
router.put('/update/:id',verifyToken,updateuser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/listings/:id' , verifyToken ,getUserListings);
export default router;
