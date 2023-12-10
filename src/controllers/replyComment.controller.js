import asyncHandler from "express-async-handler";
import ReplyCommentModel from "../models/replyCommentModel.js";
import BadRequestError from "../errors/BadRequestError.js";

const ReplyCommentController = {
   createComment: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { commentId } = req.params;
      const { commentContent, replyUser } = req.body;

      const newReplyComment = await ReplyCommentModel.create({
         author: userId,
         commentId,
         replyUser,
         commentContent,
      });

      res.status(200).json(newReplyComment);
   }),

   getAllByCommentId: asyncHandler(async (req, res) => {
      const { commentId } = req.params;
      const page = req.query.page;
      const limit = req.query.limit;

      const count = await ReplyCommentModel.countDocuments({ commentId: commentId });

      if (count === 0) {
         throw new BadRequestError("Không có bình luận");
      }

      const options = {
         page: page || 1,
         limit: limit || 5,
         sort: { createdAt: -1 },
         populate: [
            {
               path: "author",
               select: "fullName avatar",
            },
            {
               path: "replyUser",
               select: "fullName",
            },
         ],
      };

      const allReplyComments = await ReplyCommentModel.paginate({ commentId: commentId }, options);

      res.status(200).json(allReplyComments);
   }),

   updateComment: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { commentId } = req.params;
      const { commentContent, replyUser } = req.body;

      const replyComment = await ReplyCommentModel.findById(commentId);

      if (!replyComment) {
         throw new BadRequestError("Không có comment");
      }

      if (replyComment.author.toString() !== userId) {
         throw new BadRequestError("Bạn chỉ được chỉnh sửa bình luận của bản thân");
      }

      if (!commentContent) {
         throw new BadRequestError("Nội dung bình luận không được để trống");
      }

      replyComment.commentContent = commentContent;
      replyComment.replyUser = replyUser;
      await replyComment.save();

      res.status(200).json(replyComment);
   }),

   removeComment: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { commentId } = req.params;

      const replyComment = await ReplyCommentModel.findById(commentId);

      if (!replyComment) {
         throw new BadRequestError("Không có bình luận");
      }

      await replyComment.deleteOne();

      res.status(200).json({ message: "Xóa thành công " });
   }),
};

export default ReplyCommentController;
