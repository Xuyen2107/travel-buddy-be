import mongoose from "mongoose";

export const connectToDatabase = async () => {
   try {
      await mongoose.connect(process.env.DB_URL);
      console.log("Database is connected");
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};
