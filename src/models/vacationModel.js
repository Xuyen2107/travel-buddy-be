import mongoose from "mongoose";
import autopopulate from "mongoose-autopopulate";

const VacationSchema = new mongoose.Schema({
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
      require: true,
   },

   startDay: {
      type: Date,
      require: true,
   },

   endDay: {
      type: Date,
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

   createAt: {
      type: Date,
      default: new Date(),
   },

   updateAt: {
      type: Date,
   },
});

VacationSchema.plugin(autopopulate);

// Middleware để tự động cập nhật trường updateAt
VacationSchema.pre("save", function (next) {
   this.updateAt = new Date();
   next();
});

const VacationModel = mongoose.model("Vacations", VacationSchema);

export default VacationModel;
