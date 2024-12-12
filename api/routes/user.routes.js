import express from 'express';
import { test,updateuser,deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../routes/verifyUser.js';
const router = express.Router();

router.get('/test',test);
router.put('/update/:id',verifyToken,updateuser);
router.delete('/delete/:id',verifyToken,deleteUser)
export default router;
