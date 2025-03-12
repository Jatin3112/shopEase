import { Router } from "express";
import {
  createOrder,
  getOrder,
  updateOrderDetails,
  deleteOrder,
  getOrderItem,
} from "../controllers/orders.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/create").post(createOrder);
router.route("/:id").get(getOrder);
router.route("/:id").delete(deleteOrder);
router.route("/update/:id").patch(updateOrderDetails);
router.route("/item/:id").get(getOrderItem);

export default router;
