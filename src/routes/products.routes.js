import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProductDetails,
  updateProductImage,
} from "../controllers/products.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.js";

const router = Router();

router.route("/add").post(upload.single("productImage"), addProduct);
router.route("/:id").get(getProduct);
router.route("/:id").delete(deleteProduct);
router.route("/update/:id").patch(updateProductDetails);
router
  .route("/update/image/:id")
  .patch(upload.single("productImage"), updateProductImage);

export default router;
