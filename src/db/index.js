import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import logger from "../utils/logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    logger.info("MongoDB Connected !!");
  } catch (error) {
    logger.error("MongoDB Connection Error!", error);
    process.exit(1);
  }
};

export default connectDB;
