import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
   {
      fullName: {
         type: String,
         require: true,
      },

      userName: {
         type: String,
         require: true,
         unique: true,
      },

      email: {
         type: String,
         require: true,
         unique: true,
      },

      phoneNumber: {
         type: String,
         require: true,
         unique: true,
      },

      password: {
         type: String,
         require: true,
      },

      avatar: {
         type: String,
      },

      friends: {
         type: [
            {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Users",
            },
         ],
         default: [],
      },

      age: {
         type: Number,
      },

      dateOfBirth: {
         type: String,
      },

      gender: {
         type: String,
      },

      describe: {
         type: String,
      },
   },

   { timestamps: true },
);

UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      return next();
   }

   try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
   } catch (error) {
      return next(error);
   }
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
