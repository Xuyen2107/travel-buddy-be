import mongoose from "mongoose";
import { formatDate } from "../utils/formatDate.js";

const UserSchema = new mongoose.Schema({
   fullName: {
      type: String,
      require: true,
   },

   userName: {
      type: String,
      require: true,
      min: 6,
      max: 20,
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

   createAt: {
      type: String,
   },

   updateAt: {
      type: String,
   },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
