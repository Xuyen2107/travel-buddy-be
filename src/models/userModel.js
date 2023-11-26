import mongoose from "mongoose";
import bcrypt from "bcrypt";
import mongoosePaginate from "mongoose-paginate-v2";

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
         default: "https://res.cloudinary.com/dcgytjpvn/image/upload/v1700399941/Default/default-avatar_cqksnp.jpg",
      },

      age: {
         type: Number,
      },

      dateOfBirth: {
         type: String,
      },

      gender: {
         type: Number,
         enum: [1, 2, 3],
      },

      describe: {
         type: String,
      },

      city: {
         type: Object,
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

UserSchema.plugin(mongoosePaginate);

const UserModel = mongoose.model("Users", UserSchema);

UserModel.paginate().then({});

export default UserModel;
