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
      const data = JSON.parse(req.body.data);
      const files = req.files;
      const { userId } = req.user;

      const uploadPromises = files.map(async (item) => {
         const image = await uploadImage(item);

         return image;
      });

      const imageUrl = await Promise.all(uploadPromises);

      const newPost = await PostModel.create({
         ...data,
         author: userId,
         images: imageUrl,
      });

      res.status(200).json({
         data: newPost,
      });
   }),

   getPost: asyncHandler(async (req, res) => {
      const postId = req.params.postId;

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
      const page = req.query.page;

      const options = {
         page,
         limit: 5,
         sort: { createAt: -1 },
      };

      const result = await PostModel.paginate({}, options);
      console.log(result);

      res.status(200).json({
         data: result.docs,
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
      const data = req.body.data;
      const files = req.files;
      const { userId } = req.user;

      if (files) {
         const uploadPromises = files.map(async (item) => {
            const image = await uploadImage(item);

            return image;
         });

         const imageUrl = Promise.all(uploadPromises);

         data.images.push(...imageUrl);
      }

      const updatePost = await PostModel.findByIdAndUpdate(
         postId,
         {
            $set: data,
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

      const post = await PostModel.findById(postId);

      if (!post) {
         throw new BadRequestError(postMessage.notFound);
      }

      if (post.likes.includes(userId)) {
         post.likes.pull(userId);
      } else {
         post.likes.push(userId);
      }

      await post.save();

      res.status(200).json({
         message: postMessage.successfully,
      });
   }),
};

export default PostController;
