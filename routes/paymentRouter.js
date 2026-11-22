import express from "express";
const router = express.Router();
import { verifyAdmin, verifyToken } from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";

import paymentController from "../controllers/paymentController.js";

router
  .route("/")
  .get(verifyToken, verifyAdmin, AsyncError(paymentController.index))
  .post(verifyToken, AsyncError(paymentController.store));

router.route("/user").get(verifyToken, AsyncError(paymentController.indexUser));

export default router;
