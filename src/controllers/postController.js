import { check } from "express-validator";
import asyncHandler from "express-async-handler";
import PostModel from "../models/postModel.js";
import { uploadImage } from "../services/uploadImage.js";
import BadRequestError from "../errors/BadRequestError.js";
import { postMessage } from "../utils/postMessage.js";
import mongoose from "mongoose";

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

            if (
               data &&
               data.vacation &&
               mongoose.Types.ObjectId.isValid(data.vacation) &&
               data.milestone &&
               mongoose.Types.ObjectId.isValid(data.milestone) &&
               data.content &&
               data.isPublic
            ) {
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

      res.status(200).json(newPost);
   }),

   getPost: asyncHandler(async (req, res) => {
      const { postId } = req.params;

      const post = await PostModel.findById(postId)
         .populate({ path: "author", select: "fullName avatar" })
         .populate({ path: "vacation", select: "title milestones" });

      if (!post) {
         throw new BadRequestError(postMessage.notFound);
      }

      res.status(200).json(post);
   }),

   getAllPostsMilestones: asyncHandler(async (req, res) => {
      const { milestoneId } = req.params;
      const page = req.query.page;

      const options = {
         page,
         limit: 20,
         sort: { createdAt: -1 },
         populate: [
            {
               path: "author",
               select: "fullName avatar",
            },
            {
               path: "vacation",
               select: "title milestones",
            },
         ],
      };

      const result = await PostModel.paginate({ milestone: milestoneId }, options);

      res.status(200).json(result.docs);
   }),

   getAllPosts: asyncHandler(async (req, res) => {
      const page = req.query.page;

      const options = {
         page,
         limit: 5,
         sort: { createAt: -1 },
         populate: {
            path: "author",
            select: "fullName avatar",
         },
      };

      const result = await PostModel.paginate({}, options);

      res.status(200).json(result.docs);
   }),

   getAllPostsByUser: asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const page = req.query.page;

      const options = {
         page,
         limit: 5,
         sort: { createdAt: -1 },
         populate: [
            {
               path: "author",
               select: "fullName avatar",
            },
            {
               path: "vacation",
               select: "title milestones",
            },
         ],
      };

      const result = await PostModel.paginate({ author: userId }, options);

      res.status(201).json(result.docs);
   }),

   updatePost: asyncHandler(async (req, res) => {
      const { postId } = req.params;
      const data = JSON.parse(req.body.data);
      const files = req.files;
      const { userId } = req.user;

      const post = await PostModel.findById(postId);

      if (post.author._id !== userId) {
         throw new BadRequestError(postMessage.notAccept);
      }

      if (files) {
         const uploadPromises = files.map(async (item) => {
            const image = await uploadImage(item);

            return image;
         });

         const imageUrl = Promise.all(uploadPromises);

         data.images.push(...imageUrl);
      }

      const updatePost = await PostModel.findByIdAndUpdate(postId, { $set: data }, { new: true });

      res.status(200).json(updatePost);
   }),

   removePost: asyncHandler(async (req, res) => {
      const { postId } = req.params;
      const { userId } = req.user;

      const post = await PostModel.findById(postId);

      if (post.author._id !== userId) {
         throw new BadRequestError(postMessage.notAccept);
      }

      await PostModel.deleteOne(post);

      res.status(200).json({
         message: postMessage.successfully,
      });
   }),

   likePost: asyncHandler(async (req, res) => {
      const { postId } = req.params;
      const { userId } = req.user;

      const post = await PostModel.findById(postId).populate({
         path: "author",
         select: "fullName avatar",
      });

      if (!post) {
         throw new BadRequestError(postMessage.notFound);
      }

      if (post.likes.includes(userId)) {
         post.likes.pull(userId);
      } else {
         post.likes.push(userId);
      }

      await post.save();

      res.status(200).json(post);
   }),
};

export default PostController;
