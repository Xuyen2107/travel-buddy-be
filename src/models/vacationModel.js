import mongoose from "mongoose";

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
      },

      listUser: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
         },
      ],

      isPublic: {
         type: Boolean,
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
         type: Array,
         default: [],
      },
   },

   { timestamps: true },
);

const VacationModel = mongoose.model("Vacations", VacationSchema);

export default VacationModel;
