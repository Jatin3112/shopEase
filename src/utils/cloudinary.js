import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import logger from "./logger.js";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Configurations
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const updloadToCloudinary = async (localFilePath) => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    logger.info("Successfully uploaded file in cloudinary !! ", response.url);

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    logger.error("Error while uploading in cloudinary", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);

    logger.info("Deleted from cloudinary", publicId);
  } catch (error) {
    logger.error("Error deleting from cloudinary");
  }
};
export { updloadToCloudinary, deleteFromCloudinary };
