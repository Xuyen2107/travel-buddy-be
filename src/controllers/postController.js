import asyncHandler from "express-async-handler";
import PostModel from "../models/postModel.js";

// Một dạng custom error cá nhân giúp in ra lỗi, chỉ cần truyền tham số statusCode và chuỗi message
import UserError from "../utils/userError.js";

// Function uploadFile làm code ngắn hơn, chỉ cần truyền file đầu vào
import { uploadImage } from "../services/uploadImage.js";

const postController = {
   //[Get] /post
   index: async (req, res) => {
      res.json({
         message: "Test Api [Get] /api/v1/post",
      });
   },

   //[Post]   Create a new post
   createPost: asyncHandler(async (req, res) => {
      const { vacation, milestones, content, checkIn } = req.body;
      const files = req.files;
      const userId = req.user.id;

      if (!files) {
         throw new UserError(404, "Bạn chưa chọn ảnh=");
      }

      const uploadPromises = files.map(async (item) => {
         const image = await uploadImage(item);

         return image;
      });

      const imageUrl = await Promise.all(uploadPromises);

      const newPost = new PostModel({
         author: userId,
         vacation,
         milestones,
         content,
         mediaUrls: imageUrl,
         checkIn,
      });

      await newPost.save();

      res.status(200).json({
         data: newPost,
      });
   }),

   //[Get] /post/:id   //get a post
   getPost: asyncHandler(async (req, res) => {
      const postId = req.params.id;

      const post = await PostModel.findById(postId).populate({
         path: "author",
         select: "fullName userName avatar",
      });

      if (!post) {
         throw new UserError(404, "Không tìm thấy bài viết");
      }

      res.status(200).json({
         data: post,
      });
   }),

   //[Get] /post/all   // get all new feed
   getAllPosts: asyncHandler(async (req, res) => {
      const posts = await PostModel.find();

      if (!posts) {
         throw new UserError(404, "Chưa có bài viết nào trong hệ thống");
      }

      res.status(200).json({ data: posts });
   }),

   //[Get] /post/owners/:id
   //Get all post owners

   getAllPostsByUser: asyncHandler(async (req, res) => {
      const userId = req.user.id;

      const posts = await PostModel.find({ author: userId });

      if (!posts) {
         throw new UserError(404, "Không tìm thấy bất kỳ bài viết nào của user");
      }

      res.status(201).json({
         data: posts,
      });
   }),

   //[Put] /post/:id
   //Update a post

   updatePost: asyncHandler(async (req, res) => {
      const postId = req.params.id;
      const body = req.body;
      const files = req.files;
      const userId = req.user.id;

      if (files) {
         const uploadPromises = files.map(async (item) => {
            const image = await uploadImage(item);

            return image;
         });

         const imageUrl = Promise.all(uploadPromises);

         body.mediaUrls.push(...imageUrl);
      }

      body.updateAt = new Date();

      const updatePost = await PostModel.findByIdAndUpdate(
         postId,
         {
            $set: body,
         },
         { new: true },
      );

      if (!updatePost) {
         throw new UserError(404, "Bài post không tồn tại");
      }

      res.status(200).json({
         data: updatePost,
      });
   }),

   //[Delete] /post/:id  //delete a post
   removePost: asyncHandler(async (req, res) => {
      const postId = req.params.id;

      const deletePost = await PostModel.findByIdAndDelete(postId);

      if (!deletePost) {
         throw new UserError(404, "bài Post không tồn tại");
      }

      res.status(200).json({
         message: "Bài post đã được xóa thành công",
      });
   }),

   //[Post] /post/:id/like // Like a post
   likePost: asyncHandler(async (req, res) => {
      const postId = req.params.id;
      const userId = req.user.id;

      const post = await PostModel.findByIdAndUpdate(postId);

      if (!post) {
         throw new UserError(404, "Bài post không tồn tại");
      }

      const likedIndex = post.likes.findIndex((like) => like.author.toString() === userId.toString());

      if (likedIndex === -1) {
         // Nếu chưa thích, thêm user vào danh sách likes
         post.likes.push({ author: userId });

         await post.save();
         res.status(200).json({
            message: "Đã thích bài viết này",
         });
      } else {
         // Nếu đã thích, xóa user ra khỏi danh sách likes
         post.likes.splice(likedIndex, 1);
         await post.save();
         res.status(200).json({
            message: "Bài viết đã bỏ thích",
         });
      }
   }),
};

export default postController;
