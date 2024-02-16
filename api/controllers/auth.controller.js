import { errorHandler } from "../utils/error.js";
import User from "./../models/user.model.js";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;

  if (
    !username ||
    !password ||
    !email ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    next(errorHandler(400, "All Fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 8);

  const newUser = new User({
    username,
    password: hashedPassword,
    email,
  });
  try {
    await newUser.save();
    res.status(200).json("SignUp Successfull");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  // get the user info from request body
  const { email, password } = req.body;

  if (!email || !password)
    return next(errorHandler(400, "Username and Password is required"));

  try {
    // find the user in database by username
    let validUser = await User.findOne({ email });

    if (!validUser) {
      return next(errorHandler(401, "You have entered Invalid Username"));
    }

    // compare the provided password with the hashed password in database
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) {
      return next(errorHandler(401, "Invalid Password"));
    }
    // Removing password from data
    const { password: pass, ...rest } = validUser._doc;

    const token = Jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoURL } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = Jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
    } else {
      const genratedpassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(genratedpassword, 8);
      const newUser = new User({
        username:name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(4),
        password: hashedPassword,
        profilePicture: googlePhotoURL,
        email,
      });
      await newUser.save();
      const { password, ...rest } = newUser._doc;
      const token = Jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      res.status(200).cookie("access_token", token, { httpOnly: true }).json(rest);
    }
  } catch (error) {
    console.log(error);
  }
};
