import mongoose from "mongoose";
import { date } from "yup";
import { formatDate } from "../utils/formatDate.js";

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

   sex: {
      type: String,
   },

   describe: {
      type: String,
   },

   createAt: {
      type: Date,
      default: formatDate(new Date()),
   },

   updateAt: {
      type: String,
   },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
