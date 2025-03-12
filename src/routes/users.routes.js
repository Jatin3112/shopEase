import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUser,
} from "../controllers/users.controllers.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/:id").get(verifyJWT, getUser);

export default router;
