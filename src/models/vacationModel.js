import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const VacationSchema = new mongoose.Schema(
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

      avatarVacation: {
         type: String,
         required: true,
      },

      description: {
         type: String,
         required: true,
      },

      listUsers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
         },
      ],

      isPublic: {
         type: Number,
         enum: [1, 2, 3], //1: Công khai, 2: bạn bè, 3: chỉ mình tôi
         default: 1,
      },

      startDay: {
         type: String,
         required: true,
      },

      endDay: {
         type: String,
         required: true,
      },

      milestones: [
         {
            time: {
               type: String,
               required: true,
            },
            description: {
               type: String,
               required: true,
            },
         },
      ],

      likes: {
         type: [
            {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Users",
            },
         ],

         default: [],
      },
   },

   { timestamps: true },
);

VacationSchema.plugin(mongoosePaginate);

const VacationModel = mongoose.model("Vacations", VacationSchema);

VacationModel.paginate().then({});

export default VacationModel;
