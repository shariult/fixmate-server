import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";

import paymentController from "../controllers/paymentController.js";

router
  .route("/")
  .get(verifyToken, AsyncError(paymentController.index))
  .post(verifyToken, AsyncError(paymentController.store));

export default router;
