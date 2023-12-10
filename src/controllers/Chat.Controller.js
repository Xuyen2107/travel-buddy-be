import chatModel from "../models/chatModel.js";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";

const chatController = {
   createChat: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { userChat } = req.params;

      const chat = await chatModel.findOne({
         members: { $all: [userId, userChat] },
      });

      if (chat) return res.status(200).json({ chat: chat, message: "doan chat da ton tai" });

      const newChat = new chatModel({
         members: [userId, userChat],
      });

      await newChat.save();

      res.status(200).json(newChat);
   }),

   findUserChats: asyncHandler(async (req, res) => {
      const { userId } = req.user;

      const chats = await chatModel.find({
         members: { $in: [userId] },
      });

      const chatsDetails = await Promise.all(
         chats.map(async (chat) => {
            const isCurrentUserMember = chat.members.includes(userId);

            let membersInfo;

            if (isCurrentUserMember) {
               const otherMemberId = chat.members.find((memberId) => memberId !== userId);
               console.log("🚀 ~ file: Chat.Controller.js:41 ~ chats.map ~ otherMemberId:", otherMemberId);
               membersInfo = await UserModel.findById(otherMemberId).select("fullName avatar");
            } else {
               membersInfo = await UserModel.find({ _id: { $in: chat.members } }).select("fullName avatar");
            }

            return {
               chatId: chat._id,
               members: membersInfo,
            };
         }),
      );

      res.status(200).json(chatsDetails);
   }),

   findChat: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { userChat } = req.params;

      const chat = await chatModel.findById(userChat);

      if (!chat) {
         return res.status(404).json({ message: "Không tìm thấy cuộc trò chuyện" });
      }

      // Lấy thông tin thành viên từ cơ sở dữ liệu
      const userChat1 = chat.members.find((x) => x !== userId);
      const user = await UserModel.findById(userChat1).select("avatar fullName");

      res.status(200).json(user);
   }),

   findByChat: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { userChat } = req.params;

      const chat = await chatModel.findOne({
         members: { $all: [userId, userChat] },
      });

      res.status(200).json(chat);
   }),
};

export default chatController;
