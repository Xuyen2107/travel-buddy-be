import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

export const uploadImage = async (file) => {
   try {
      const result = await cloudinary.uploader.upload(file.path, {
         resource_type: "auto",
         folder: "Travel_Buddy",
      });

      const imageUrl = result && result.secure_url;

      fs.unlinkSync(file.path);

      return imageUrl;
   } catch (error) {
      console.log(error);
      fs.unlinkSync(file.path);
   }
};
