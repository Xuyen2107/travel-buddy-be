import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const VacationSchema = new mongoose.Schema(
   {
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
         require: true,
      },

      title: {
         type: String,
         require: true,
      },

      avatarVacation: {
         type: String,
         require: true,
      },

      description: {
         type: String,
         require: true,
      },

      listUser: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
         },
      ],

      isPublic: {
         type: String,
         default: true,
      },

      startDay: {
         type: String,
         require: true,
      },

      endDay: {
         type: String,
         require: true,
      },

      milestones: [
         {
            time: {
               type: String,
               require: true,
            },
            description: {
               type: String,
               require: true,
            },
         },
      ],

      views: {
         type: Array,
         default: [],
      },

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
