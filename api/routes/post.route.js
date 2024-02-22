import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPost, deletePost, getposts, updatePost } from "../controllers/post.controller.js";

const router = express.Router();

router.post('/create', verifyToken, createPost)
router.get('/getposts', getposts)
router.put('/update/:postId/:userId', verifyToken, updatePost)
router.delete('/delete/:postId/:userId',verifyToken, deletePost)


export default router;