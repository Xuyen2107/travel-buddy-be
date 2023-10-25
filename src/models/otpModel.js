import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
   email: {
      type: String,
      require: true,
   },

   code: {
      type: String,
      require: true,
   },

   createAt: {
      type: Date,
      default: new Date(),
   },
});

const OtpModel = mongoose.model("Otp", OtpSchema);

export default OtpModel;
