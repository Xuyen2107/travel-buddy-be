import asyncHandler from "express-async-handler";
import CommentModel from "../models/commentModel.js";
import BadRequestError from "../errors/BadRequestError.js";

const CommentController = {
   createComment: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { postId } = req.params;
      const { commentContent } = req.body;

      const newComment = await CommentModel.create({
         author: userId,
         postId: postId,
         commentContent: commentContent,
      });

      res.status(200).json(newComment);
   }),

   getCommentsByPost: asyncHandler(async (req, res) => {
      const { postId } = req.params;
      const page = req.query.page;
      const limit = req.query.limit;

      const count = await CommentModel.countDocuments({ postId: postId });
      if (count === 0) {
         throw new BadRequestError("Không có comment");
      }

      const options = {
         page: page || 1,
         limit: limit || 10,
         sort: { createdAt: -1 },
         populate: {
            path: "author",
            select: "fullName avatar",
         },
      };

      const allComments = await CommentModel.paginate({ postId: postId }, options);

      res.status(200).json(allComments);
   }),

   getNumberComment: asyncHandler(async (req, res) => {
      const { postId } = req.params;

      const count = await CommentModel.countDocuments({ postId: postId });

      res.status(200).json(count);
   }),

   updateComment: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { commentId } = req.params;
      const { commentContent } = req.body;

      const comment = await CommentModel.findById(commentId);

      if (!comment) {
         throw new BadRequestError("Không có comment");
      }

      if (comment.author.toString() !== userId) {
         throw new BadRequestError("Bạn chỉ được chỉnh sửa bình luận của bản thân");
      }

      if (!commentContent) {
         throw new BadRequestError("Nội dung bình luận không được để trống");
      }

      comment.commentContent = commentContent;
      await comment.save();

      res.status(200).json(comment);
   }),

   removeComment: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { commentId } = req.params;

      const comment = await CommentModel.findById(commentId);

      if (!comment) {
         throw new BadRequestError("Không có comment");
      }
      comment.isDeleted = true;
      await comment.save();

      res.status(200).json(comment);
   }),
};

export default CommentController;
