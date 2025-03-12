import { Router } from "express";
import { heathCheck } from "../controllers/healthCheck.controllers.js";

const router = Router()

router.route("/").get(heathCheck)

export default router