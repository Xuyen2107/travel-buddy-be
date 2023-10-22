import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
      unique: true,
   },

   password: {
      type: String,
      require: true,
   },

   avatar: {
      type: String,
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

   createAt: {
      type: Date,
      default: Date.now(),
   },

   updateAt: {
      type: Date,
   },
});

UserSchema.pre("save", function (next) {
   this.updateAt = new Date();
   next();
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
