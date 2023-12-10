import MessageModel from "../models/messageModel.js";
import asyncHandler from "express-async-handler";

const messageController = {
   createMessage: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { chatId, text } = req.body;

      const message = new MessageModel({
         chatId,
         senderId: userId,
         text,
      });

      await message.save();

      res.status(200).json(message);
   }),

   getMessages: asyncHandler(async (req, res) => {
      const { chatId } = req.params;
      const page = req.query.page;

      const options = {
         page,
         limit: 20,
         sort: { createdAt: -1 },
         populate: {
            path: "senderId",
            select: "avatar",
         },
      };

      const messages = await MessageModel.paginate({ chatId: chatId }, options);

      res.status(200).json(messages);
   }),
};

export default messageController;
