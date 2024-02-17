import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';


export const updateUser = async(req, res,next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(401, 'Unauthorised User'))

    }
    console.log(req.body)
    if(req.body.password){
        if(req.body.password < 6){  
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }
        const hashedPassword = bcryptjs.hashSync(req.body.password, 8);
        req.body.password = hashedPassword
    }
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username > 20){
            return next(errorHandler(400, 'Username must be between 7 to 20 characters'))
        }
    }

    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                password:req.body.password,
                email:req.body.email,
                profilePicture:req.body.profilePicture
            }
        },{ new:true })
        res.status(200).json(updateUser);
    } catch (error) {
        next(error);
    }
}