import mongoose from "mongoose";

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

VacationSchema.plugin(autopopulate);

// Middleware để tự động cập nhật trường updateAt
// Cập nhật lúc lưu, lúc update ko tự cập nhât vì ko dùng save()
VacationSchema.pre("save", function (next) {
   this.updateAt = new Date();
   next();
});

const VacationModel = mongoose.model("Vacations", VacationSchema);

export default VacationModel;
