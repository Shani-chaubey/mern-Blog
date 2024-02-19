import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from  './routes/user.route.js'
import authRoutes from  './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();

app.use(express.json())
app.use(cookieParser())
mongoose.connect(process.env.MONGO)
.then( () => {console.log("Database is connected")} ).catch( (err) => console.log(err));





app.use('/api/user', userRoutes);
app.use('/api/auth',authRoutes)
app.use('/api/posts', postRoutes);


app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    res.json({
        success:false,
        statusCode,
        message
    })
})


app.listen(3000, () => {
   console.log('Server is running on port: 3000!');
});