import { check } from "express-validator";
import asyncHandler from "express-async-handler";
import PostModel from "../models/postModel.js";
import { uploadImage } from "../services/uploadImage.js";
import BadRequestError from "../errors/BadRequestError.js";
import { postMessage } from "../utils/postMessage.js";

const PostController = {
   validatePost: [
      check("images").custom((value, { req }) => {
         if (!req.files) {
            throw new BadRequestError(postMessage.images.notEmpty);
         }

         return true;
      }),

      check("data").custom((value) => {
         try {
            const data = value ? JSON.parse(value) : {};

            if (data && data.vacation && data.milestones && data.milestones.time && data.milestones.description && data.content && data.isPublic) {
               return true;
            }

            throw new BadRequestError(postMessage.error);
         } catch (error) {
            throw new Error(postMessage.error);
         }
      }),
   ],

   createPost: asyncHandler(async (req, res) => {
      const data = req.body.data ? JSON.parse(req.body.data) : {};
      const files = req.files;
      const userId = req.user.id;

      const uploadPromises = files.map(async (item) => {
         const image = await uploadImage(item);

         return image;
      });

      const imageUrl = await Promise.all(uploadPromises);

      const newPost = await PostModel.create({
         author: userId,
         vacation: data.vacation,
         milestones: data.milestones,
         content: data.content,
         images: imageUrl,
      });

      res.status(200).json({
         data: newPost,
      });
   }),

   getPost: asyncHandler(async (req, res) => {
      const postId = req.params.id;

      const post = await PostModel.findById(postId).populate({
         path: "author",
         select: "fullName avatar",
      });

      if (!post) {
         throw new BadRequestError(postMessage.notFound);
      }

      res.status(200).json({
         data: post,
      });
   }),

   getAllPosts: asyncHandler(async (req, res) => {
      const posts = await PostModel.find();

      if (!posts) {
         throw new BadRequestError(postMessage.notFound);
      }

      res.status(200).json({
         data: posts,
      });
   }),

   getAllPostsByUser: asyncHandler(async (req, res) => {
      const { userId } = req.user;

      const posts = await PostModel.find({ author: userId });

      if (!posts) {
         throw new BadRequestError(postMessage.notFound);
      }

      res.status(201).json({
         data: posts,
      });
   }),

   updatePost: asyncHandler(async (req, res) => {
      const postId = req.params.postId;
      const body = req.body;
      const files = req.files;
      const { userId } = req.user;

      if (files) {
         const uploadPromises = files.map(async (item) => {
            const image = await uploadImage(item);

            return image;
         });

         const imageUrl = Promise.all(uploadPromises);

         body.images.push(...imageUrl);
      }

      const updatePost = await PostModel.findByIdAndUpdate(
         postId,
         {
            $set: body,
         },
         { new: true },
      );

      res.status(200).json({
         data: updatePost,
      });
   }),

   removePost: asyncHandler(async (req, res) => {
      const postId = req.params.postId;

      const deletePost = await PostModel.findByIdAndDelete(postId);

      res.status(200).json({
         message: postMessage.successfully,
      });
   }),

   likePost: asyncHandler(async (req, res) => {
      const postId = req.params.postId;
      const { userId } = req.user;

      const post = await PostModel.findByIdAndUpdate(postId);

      if (!post) {
         throw new BadRequestError(postMessage.notFound);
      }

      const likedIndex = post.likes.findIndex((like) => like.author.toString() === userId.toString());

      if (likedIndex === -1) {
         // Nếu chưa thích, thêm user vào danh sách likes
         post.likes.push({ author: userId });

         await post.save();
         res.status(200).json({ message: "Đã thích bài viết này" });
      } else {
         // Nếu đã thích, xóa user ra khỏi danh sách likes
         post.likes.splice(likedIndex, 1);
         console.log("likedIndex", likedIndex);
         await post.save();
         res.status(200).json({ message: "Bài viết đã bỏ thích" });
      }
   }),
};

export default PostController;
