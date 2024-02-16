import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';


export const updateUser = async(req, res,next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(401, 'Unauthorised User'))

    }
    if(req.body.password){
        if(req.body.password < 6){  
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }
        const hashedPassword = bcryptjs.hashSync(req.body.password, 8);
    }
    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username > 20){
            return next(errorHandler(400, 'Username must be between 7 to 20 characters'))
        }
    }
    if(req.body.username.includes(' ')){
        return next(errorHandler(400, 'Username cannot contain spaces'))
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username:req.body.username,
                password:req.body.password,
                email:req.body.email,
                profilePicture:req.body.profilePicture
            }
        },{ new:true })
        const {password:pass, ...rest} = updateUser._doc;
    } catch (error) {
        next(error);
    }
}