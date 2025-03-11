import mongoose, { Schema } from "mongoose";

const ordersSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    orderItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItems",
      },
    ],
    address: {
      type: String,
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Orders = mongoose.model("Orders", ordersSchema);
