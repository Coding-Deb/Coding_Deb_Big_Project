import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (file) => {
  try {
    if (file) {
      const uploadedFile = await cloudinary.uploader.upload(file.path, {
        folder: "profile-pictures",
        resource_type: "auto",
        overwrite: true,
        format: "jpg" || "png",
        transformation: [{ width: 500, height: 500, crop: "fill" }],
      });
      // Delete the file from the local storage
      fs.unlinkSync(file.path);
      return uploadedFile;
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error(error);
  }
};

