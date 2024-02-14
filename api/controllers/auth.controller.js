import { errorHandler } from '../utils/error.js';
import User from './../models/user.model.js';
import bcryptjs from  'bcryptjs';

export const signup = async (req,res,next)=>{

    const { username, password, email } = req.body;

    if( !username || !password || !email || username==='' || password==='' || email==='' ){
        next(errorHandler(400, "All Fields are required"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 8);

    const newUser = new User({
        username, 
        password: hashedPassword, 
        email});
    try {
        await newUser.save();
        res.status(200).json('SignUp Successfull')
    } catch (error) {
       next(error);
    }
    
}