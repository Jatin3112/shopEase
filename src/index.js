import dotenv from "dotenv";
import { app } from "./app.js";
import logger from "./utils/logger.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("MongoDB Connection Error", err);
  });
