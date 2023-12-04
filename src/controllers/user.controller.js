import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { uploadImage } from "../services/uploadImage.js";
import BadRequestError from "../errors/BadRequestError.js";
import { userMessages } from "../utils/userMessage.js";
import UserModel from "../models/userModel.js";
import FriendModel from "../models/friendModel.js";

const UserController = {
   getUser: asyncHandler(async (req, res) => {
      const { userId } = req.params;

      const user = await UserModel.findById(userId).select("-password");

      if (!user) {
         throw new BadRequestError(userMessages.notEmpty);
      }

      return res.status(200).json(user);
   }),

   updateUser: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const body = req.body;

      const newUser = await UserModel.findByIdAndUpdate(userId, { $set: body }, { new: true }).select("-password");

      res.status(200).json(newUser);
   }),

   uploadAvatar: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const file = req.file;

      if (!file) {
         throw new BadRequestError(userMessages.avatar.notEmpty);
      }

      const avatarUrl = await uploadImage(file);

      const updateUser = await UserModel.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select("-password");

      res.status(200).json(updateUser);
   }),

   updatePassword: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { password, newPassword } = req.body;

      const user = await UserModel.findById(userId).select("password");

      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
         throw new BadRequestError(400, userMessages.password.passwordErr);
      }

      const salt = await bcrypt.genSalt(10);
      const haledPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.findByIdAndUpdate(userId, { password: haledPassword }, { new: true });

      res.status(200).json({
         message: userMessages.successfully,
      });
   }),

   sendFriendRequest: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const friendId = req.params.userId;

      if (userId === friendId) {
         throw new BadRequestError("Bạn không thể thêm chính mình");
      }

      const existingFriend = await FriendModel.findOne({
         $or: [
            { user: userId, friend: friendId },
            { user: friendId, friend: userId },
         ],
      });

      if (existingFriend) {
         throw new BadRequestError("Yêu cầu kết bạn đã được gửi trước đó.");
      }

      const user = await FriendModel.create({
         user: userId,
         friend: friendId,
         sender: userId,
      });

      const friend = await FriendModel.create({
         user: friendId,
         friend: userId,
         sender: userId,
      });

      res.status(200).json(user);
   }),

   acceptFriendRequest: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const friendId = req.params.userId;

      const userRecord = await FriendModel.findOne({ user: userId, friend: friendId });

      if (!userRecord) {
         throw new BadRequestError("Yêu cầu kết bạn không tồn tại hoặc đã được xử lý.");
      }

      if (userRecord.sender.toString() === userId) {
         throw new BadRequestError("Bạn không thể đồng ý khi gửi kết bạn");
      }

      const friendRecord = await FriendModel.findOne({ user: friendId, friend: userId });

      if (!friendRecord) {
         throw new BadRequestError("Yêu cầu kết bạn không tồn tại hoặc đã được xử lý.");
      }

      userRecord.status = 2;
      friendRecord.status = 2;

      await userRecord.save();
      await friendRecord.save();

      res.status(200).json(userRecord);
   }),

   removeFriend: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const friendId = req.params.userId;

      const userRemove = await FriendModel.findOneAndDelete({ user: userId, friend: friendId });

      if (!userRemove) {
         throw new BadRequestError("Yêu cầu kết bạn không tồn tại hoặc đã được xử lý.");
      }

      const friendRemove = await FriendModel.findOneAndDelete({ user: friendId, friend: userId });

      if (!friendRemove) {
         throw new BadRequestError("Yêu cầu kết bạn không tồn tại hoặc đã được xử lý.");
      }

      res.status(200).json({
         message: "Đã từ chối yêu cầu kết bạn và xóa kết bạn.",
      });
   }),

   getFriendsUser: asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const page = req.query.page;

      const options = {
         page: parseInt(page),
         limit: 10,
         select: "friend",
         sort: { createdAt: -1 },
         populate: {
            path: "friend",
            select: "fullName avatar",
         },
      };

      const result = await FriendModel.paginate({ user: userId, status: 2 }, options);

      return res.status(200).json(result.docs);
   }),
   getFriendsSend: asyncHandler(async (req, res) => {
      const { userId } = req.params;
      const page = req.query.page;

      const options = {
         page: parseInt(page),
         limit: 10,
         select: "friend sender",
         sort: { createdAt: -1 },
         populate: {
            path: "friend",
            select: "fullName avatar",
         },
      };

      const result = await FriendModel.paginate({ user: userId, status: 1 }, options);

      return res.status(200).json(result.docs);
   }),

   getSingleFriend: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const friendId = req.params.userId;

      if (userId === friendId) {
         throw new BadRequestError("Bạn đang ở trang cá nhân bản thân");
      }

      const friend = await FriendModel.findOne({
         $or: [
            { user: userId, friend: friendId },
            { user: friendId, friend: userId },
         ],
      });

      if (!friend) {
         throw new BadRequestError("Yêu cầu không tồn tại");
      }

      res.status(200).json(friend);
   }),

   searchUser: asyncHandler(async (req, res) => {
      const { keywordUser } = req.body;
      const uppercaseKeywordUser = keywordUser.toUpperCase();
      const allUser = await UserModel.find({ fullName: { $in: uppercaseKeywordUser } }).select("fullName avatar");
      if (allUser.length === 0) {
         throw new BadRequestError("Không có dữ liệu ");
      }
      res.status(200).json(allUser);
   }),
};

export default UserController;
