import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log("err");
})
const app = express();
app.use(express.json());
app.use('/api/user',userRouter);
app.listen(4000,()=>{
    console.log('server is running on port 4000');
    
});

