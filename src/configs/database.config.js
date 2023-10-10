import mongoose from "mongoose";

export const connectToDatabase = async () => {
   try {
      await mongoose.connect(
         process.env.MONGO_URL ||
            "mongodb+srv://hoangxuyen30:Meloetta@cluster0.0yo4k34.mongodb.net/?retryWrites=true&w=majority"
      );
      console.log("Database is connected");
   } catch (error) {
      console.log(error);
      process.exit(1);
   }
};
