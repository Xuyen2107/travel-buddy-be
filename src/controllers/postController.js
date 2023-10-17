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

  create: async (req, res) => {
    try {
      const { author, vacation, milestones, content, mediaUrls, checkIn } =
        req.body;

      const userId = req.user.id;

      const currentUser = await UserModel.findById(userId);

      if (!currentUser) {
        res.status(404).json({
          message: "không tìm thấy user",
        });
      }

      const newPost = new PostModel({
        author,
        user: userId,
        vacation,
        milestones,
        content,
        mediaUrls,
        checkIn,
      });

      const savedPost = await newPost.save();

      res.status(201).json(savedPost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Get] /post/all
  // get all new feed

  getAllPosts: async (req, res) => {
    try {
      const posts = await PostModel.find();

      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Get] /post/:id
  //get a post
  getSingle: async (req, res) => {
    try {
      const postId = req.params.id;

      const post = await PostModel.findById(postId);

      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Get] /post/owners/:id
  //Get all post owners

  getAllOwnerPosts: async (req, res) => {
    try {
      const userId = req.user.id;

      const posts = await PostModel.find({ user: userId });

      if (posts.length === 0) {
        return res
          .status(404)
          .json("Không tìm thấy bất kỳ bài viết nào của user");
      }
      res.status(201).json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Put] /post/:id
  //Update a post

  update: async (req, res) => {
    try {
      const postId = req.params.id;
      const { author, vacation, milestones, content, mediaUrls, checkIn } =
        req.body;

      const userId = req.user.id;

      const currentUser = await UserModel.findById(userId);

      if (!currentUser) {
        res.status(404).json({
          message: "không tìm thấy user",
        });
      }

      const updatePost = await PostModel.findByIdAndUpdate(
        postId,
        {
          author,
          user: userId,
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

      res.status(200).json(updatePost);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  //[Delete] /post/:id
  //delete a post

  remove: async (req, res) => {
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

      const likedIndex = post.likes.findIndex(
        (like) => like.user.toString() === userId.toString()
      );

      if (likedIndex === -1) {
        // Nếu chưa thích, thêm user vào danh sách likes
        post.likes.push({ user: userId });
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
};

export default postController;
