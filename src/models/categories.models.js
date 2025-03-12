import mongoose, { Schema } from "mongoose";

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Categories = mongoose.model("Categories", categoriesSchema);
