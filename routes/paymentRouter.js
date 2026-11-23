import express from "express";
const router = express.Router();
import {
  verifyAdmin,
  verifyCustomer,
  verifyToken,
} from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";

import paymentController from "../controllers/paymentController.js";

router
  .route("/")
  .post(verifyToken, verifyCustomer, AsyncError(paymentController.create));

router
  .route("/customer")
  .get(
    verifyToken,
    verifyCustomer,
    AsyncError(paymentController.listUserPayments),
  );

export default router;
