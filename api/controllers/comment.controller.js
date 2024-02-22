import Comment from "../models/comment.modal.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (!content || !postId || !userId) throw new Error("Missing fields");
    if (userId !== req.user.id) {
      return next(errorHandler(403, "You are not allowed to create a comment"));
    }
    const newComment = new Comment({ content, postId, userId });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(errorHandler(404, "No comment found"));
  }
  const userIndex = comment.likes.indexOf(req.user.id);
  if (userIndex === -1) {
    comment.likes.push(req.user.id);
    comment.numberOfLikes += 1;
    await comment.save();
    res.status(200).json(comment);
  } else {
    comment.likes.splice(userIndex, 1);
    comment.numberOfLikes -= 1;
    await comment.save();
    res.status(200).json(comment);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const commentCheck = await Comment.findById(req.params.commentId);

    if (!commentCheck) {
      return next(errorHandler(404, "No comment found"));
    }
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
      }
      if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return next(
          errorHandler(403, 'You are not allowed to edit this comment')
        );
      }
  
      const editedComment = await Comment.findByIdAndUpdate(
        req.params.commentId,
        {
          content: req.body.content,
        },
        { new: true }
      );
      res.status(200).json(editedComment);
    } catch (error) {
      next(error);
    }
  };