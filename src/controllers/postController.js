import mongoose from "mongoose";
import CommentModel from "../models/commentModel.js";
import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";

const postController = {
  //[Get] /post
  index: async (req, res) => {
    res.json({
      message: "Test Api [Get] /api/v1/post",
    });
  },

  //[Post]
  //Create a new post

  createPost: async (req, res) => {
    try {
      const { vacation, milestones, content, mediaUrls, checkIn } = req.body;

      const userId = req.user.id;

      const newPost = new PostModel({
        author: userId,
        vacation,
        milestones,
        content,
        mediaUrls,
        checkIn,
      });
      await newPost.save();

      res.status(200).json({
        data: newPost,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Get] /post/all
  // get all new feed

  getAllPosts: async (req, res) => {
    try {
      const posts = await PostModel.find();

      res.status(200).json({ data: posts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Get] /post/:id
  //get a post
  getSinglePost: async (req, res) => {
    try {
      const postId = req.params.id;

      const post = await PostModel.findById(postId).populate({
        path: "author",
        select: "fullName phoneNumber userName",
      });

      res.status(200).json({ data: post });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Get] /post/owners/:id
  //Get all post owners

  getAllOwnerPosts: async (req, res) => {
    try {
      const userId = req.user.id;

      const posts = await PostModel.find({ author: userId });

      if (!posts) {
        return res
          .status(404)
          .json("Không tìm thấy bất kỳ bài viết nào của user");
      }
      res.status(201).json({ data: posts });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Put] /post/:id
  //Update a post

  updatePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const { vacation, milestones, content, mediaUrls, checkIn } = req.body;

      const userId = req.user.id;

      const updatePost = await PostModel.findByIdAndUpdate(
        postId,
        {
          author: userId,
          vacation,
          milestones,
          content,
          mediaUrls,
          checkIn,
          updateAt: Date.now(),
        },
        { new: true }
      );

      if (!updatePost) {
        return res.status(404).json({ message: "bài post không tồn tại" });
      }

      res.status(200).json({ data: updatePost });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Delete] /post/:id
  //delete a post

  removePost: async (req, res) => {
    try {
      const postId = req.params.id;

      const deletePost = await PostModel.findByIdAndDelete(postId);

      if (!deletePost) {
        return res.status(404).json({ message: "bài Post không tồn tại" });
      }

      res.status(200).json({ message: "Bài post đã được xóa thành công" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Post] /post/:id/like
  // Like a post
  likePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.id;

      const post = await PostModel.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "Bài post không tồn tại" });
      }

      if (!post) {
        return res.status(404).json({ message: "Bài post không tồn tại" });
      }

      const likedIndex = post.likes.findIndex(
        (like) => like.author.toString() === userId.toString()
      );

      if (likedIndex === -1) {
        // Nếu chưa thích, thêm user vào danh sách likes
        post.likes.push({ author: userId });

        await post.save();
        res.status(200).json({ message: "Đã thích bài viết này" });
      } else {
        // Nếu đã thích, xóa user ra khỏi danh sách likes
        post.likes.splice(likedIndex, 1);
        await post.save();
        res.status(200).json({ message: "Bài viết đã bỏ thích" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  commentOnPost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const { text } = req.body;

      const post = await PostModel.findById(postId);

      if (!post) {
        return res.status(404).json({ message: "bài post này không tồn tại" });
      }

      const comment = new CommentModel({
        author: userId,
        text: text,
        idPost: postId,
      });

      post.comments.push(comment);

      await post.save();

      res.status(200).json({
        message: "bài post đã được bình luận",
        data: post.comments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

export default postController;
