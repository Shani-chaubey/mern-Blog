import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, "Unauthorised User"));
  }
  if (req.body.password) {
    if (req.body.password < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    const hashedPassword = bcryptjs.hashSync(req.body.password, 8);
    req.body.password = hashedPassword;
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username > 20) {
      return next(
        errorHandler(400, "Username must be between 7 to 20 characters")
      );
    }
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(401, "Unauthorised User"));
  }

  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User Deleted");
  } catch (error) {
    return next(errorHandler(401, "Unable to delete the account"));
  }
};

export const signOutUser = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Signed Out Successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      return next(
        errorHandler(401, "You Don't have access to see all the users")
      );
    }
    const startIndex = req.query.startIndex || 0
    const limit = req.query.limit || 9
    const sortDirection = req.query.sort === 'asc'? 1 : -1
    
    const usersList = await User.find().sort({updatedAt : sortDirection}).skip(startIndex).limit(limit);
    const totalUsers = await User.countDocuments();
    const withOutPasswordUsers = usersList.map((user) => {
       const {password, ...rest} = user._doc
       return rest;
       });

       const now = new Date();
  
       const oneMonthAgo = new Date(
         now.getFullYear(),
         now.getMonth() - 1,
         now.getDate()
       );
   
       const lastMonthUsers = await User.countDocuments({
         createdAt: { $gte: oneMonthAgo },
       });

    res.status(200).json({
      users : withOutPasswordUsers,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
}



export const getUser = async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.userId);
    const { password , ...rest } = user._doc
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
}

