import Post from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"

export const createPost = async(req,res,next)=>{
    if(!req.user.isAdmin){
        return next(errorHandler(403,'You are not allowed to create a post'))
    }
    if(!req.body.title || !req.body.content){
        return next(errorHandler(422,"Missing data"))
    }
    const slug = req.body.title.toLowerCase().replace(/[^a-zA-Z0-9-]/gi, '').normalize('NFD').trim()
    const newPost = new Post({...req.body ,slug, userId:req.user.id })
    
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        next(errorHandler(500,error))
    }
   
}