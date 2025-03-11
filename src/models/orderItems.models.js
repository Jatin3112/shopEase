import mongoose, { Schema } from "mongoose";

const orderItemsSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Products",
    },
  },
  { timestamps: true }
);

export const OrderItems = mongoose.model("OrderItems", orderItemsSchema);
