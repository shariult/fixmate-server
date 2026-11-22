import express from "express";
const router = express.Router();
import {
  verifyAdmin,
  verifyCustomer,
  verifyTechnician,
  verifyToken,
} from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";

import bookingController from "../controllers/BookingController.js";

router
  .route("/")
  .post(verifyToken, verifyCustomer, AsyncError(bookingController.store));

router
  .route("/payments")
  .get(verifyToken, AsyncError(bookingController.userPayments));

router
  .route("/admin")
  .get(verifyToken, verifyAdmin, AsyncError(bookingController.indexAdmin));

router
  .route("/:bId")
  .get(verifyToken, AsyncError(bookingController.show))
  .put(verifyToken, AsyncError(bookingController.update));

router
  .route("/:bId/cancel")
  .get(verifyToken, verifyCustomer, AsyncError(bookingController.cancel));

router
  .route("/:bId/status")
  .put(verifyToken, verifyTechnician, AsyncError(bookingController.status));

export default router;
