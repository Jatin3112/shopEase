import mongoose, { Schema } from "mongoose";

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
    },
    productImage: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Categories",
    },
    productOwner: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

export const Products = mongoose.model("Products", productsSchema);
