import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
dotenv.config();
mongoose.connect(process.env.MONGO).then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log("err");
})
const app = express();
app.use(express.json());

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);



app.listen(4000,()=>{
    console.log('server is running on port 4000');
    
});

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success :false,
        statusCode:statusCode,
        message,
    })
})

