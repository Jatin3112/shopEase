import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Orders } from "../models/orders.models.js";
import { User } from "../models/users.models.js";
import { OrderItems } from "../models/orderItems.models.js";

const createOrder = asyncHandler(async (req, res) => {
  const { customer, orderItems, address, paymentId } = req.body;
  const customerObject = await User.findOne({ username: customer });

  if (!customerObject) {
    throw new ApiError(404, "Customer Not Found");
  }

  const createdOrderItems = await OrderItems.insertMany(orderItems);

  const orderItemsIds = createdOrderItems.map((orderItem) => orderItem._id);

  const order = await Orders.create({
    customer: customerObject._id,
    orderItems: orderItemsIds,
    address,
    paymentId,
  });

  const newOrder = await Orders.findById(order._id);
  if (!newOrder) {
    throw new ApiError(402, "Something went wrong in creating a new order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newOrder, "New Order Created Successfully"));
});

const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Orders.findById(id);
  if (!order) {
    throw new ApiError(404, "Order Not Found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order Fetched Successfully!"));
});

const updateOrderDetails = asyncHandler(async (req, res) => {
  const { orderItems } = req.body;
  const { id } = req.params;

  const order = await Orders.findById(id);
  if (!order) {
    throw new ApiError(404, "Order not found!");
  }

  const createdOrderItems = await OrderItems.insertMany(orderItems);

  const orderItemsIds = createdOrderItems.map((orderItem) => orderItem._id);

  const updatedOrder = await Orders.findByIdAndUpdate(order._id, {
    orderItems: orderItemsIds,
  });

  const orderAfterUpdation = await Orders.findById(updatedOrder._id);

  return res
    .status(200)
    .json(
      new ApiResponse(200, orderAfterUpdation, "Order Updated Successfully!")
    );
});

const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedOrder = await Orders.findByIdAndDelete(id);

  if (!deletedOrder) {
    throw new ApiError(404, "Order to be deleted not found!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedOrder, "Order Deleted Successfully!"));
});

const getOrderItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const orderItem = await OrderItems.findById(id);

  if (!orderItem) {
    throw new ApiError(404, "Order Item not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, orderItem, "Order Item Fetched Successfully!"));
});
export { createOrder, getOrder, updateOrderDetails, deleteOrder, getOrderItem };
