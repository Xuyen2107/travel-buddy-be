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
        res.status(400).json({
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
};

export default postController;
