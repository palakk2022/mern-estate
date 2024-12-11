import express from 'express';
import { test,updateuser } from '../controllers/user.controller.js';
import { verifyToken } from './verifyUser.js';
const router = express.Router();

router.get('/test',test);
router.post('/update/:id',verifyToken,updateuser)
export default router;
