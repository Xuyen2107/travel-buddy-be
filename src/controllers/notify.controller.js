// notifyController.js
import asyncHandler from "express-async-handler";
import NotifyModel from "../models/notifyModel.js";

const NotifyController = {
   getAllNotifiesForRecipient: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const page = req.query.page;

      const options = {
         page,
         limit: 10,
         sort: { createdAt: -1 },
         populate: [{ path: "author", select: "fullName avatar" }],
      };

      const allNotifiesForRecipient = await NotifyModel.paginate(
         {
            recipients: userId,
         },
         options,
      );

      res.status(200).json(allNotifiesForRecipient);
   }),

   markNotifyAsRead: asyncHandler(async (req, res) => {
      const { notifyId } = req.params;
      const { userId } = req.user;

      const notify = await NotifyModel.findById(notifyId);

      if (!notify) {
         res.status(404).json({ message: "Thông báo không tồn tại" });
         return;
      }

      if (!notify.recipients.includes(userId)) {
         res.status(403).json({ message: "Bạn không có quyền đánh dấu là đã đọc cho thông báo này" });
         return;
      }

      if (notify.isRead) {
         res.status(400).json({ message: "Thông báo đã được đánh dấu là đã đọc trước đó" });
         return;
      }

      notify.isRead = true;
      await notify.save();

      res.status(200).json({ message: "Đã đánh dấu thông báo là đã đọc" });
   }),
};

export default NotifyController;
