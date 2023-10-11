import mongoose from "mongoose";

const VacationSchema = new mongoose.Schema({
   promoter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
   },

   title: {
      type: String,
      require: true,
   },

   description: {
      type: String,
   },

   numberUser: {
      type: Number,
   },

   listUser: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
      },
   ],

   isPublic: {
      type: String,
      require: true,
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
            required: true,
         },
         description: {
            type: String,
            required: true,
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

   createAt: {
      type: String,
   },

   updateAt: {
      type: String,
   },
});

const VacationModel = mongoose.model("Vacations", VacationSchema);

export default VacationModel;
