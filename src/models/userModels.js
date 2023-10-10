import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   fullName: {
      type: String,
      require: true,
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

   userName: {
      type: String,
      require: true,
      min: 6,
      max: 20,
      unique: true,
   },

   password: {
      type: String,
      require: true,
      min: 6,
      max: 10,
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

   sex: {
      type: String,
   },

   describe: {
      type: String,
   },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
