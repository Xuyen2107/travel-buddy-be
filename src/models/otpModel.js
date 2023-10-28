import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         require: true,
      },

      code: {
         type: String,
         require: true,
      },
   },

   { timestamps: true },
);

const OtpModel = mongoose.model("Otp", OtpSchema);

export default OtpModel;
