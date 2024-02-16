import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F1%2F12%2FUser_icon_2.svg%2F1200px-User_icon_2.svg.png&tbnid=XZYrLfpfTGrBjM&vet=12ahUKEwjxk9WAjK-EAxXAwaACHURAC9EQMygAegQIARB0..i&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FUser_(computing)&docid=atclW7KF7OcQ7M&w=1200&h=1200&q=user&ved=2ahUKEwjxk9WAjK-EAxXAwaACHURAC9EQMygAegQIARB0",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
