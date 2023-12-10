import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const NotifySchema = new mongoose.Schema(
   {
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
         required: true,
      },

      title: {
         type: String,
         required: true,
      },

      content: {
         type: String,
         required: true,
      },

      recipients: [
         {
            userId: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Users",
            },
            isRead: {
               type: Boolean,
               default: false,
            },
         },
      ],

      link: {
         type: String,
      },
   },

   { timestamps: true },
);

NotifySchema.plugin(mongoosePaginate);

const NotifyModel = mongoose.model("Notifies", NotifySchema);

export default NotifyModel;
