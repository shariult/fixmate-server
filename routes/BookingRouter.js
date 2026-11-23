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
  .post(verifyToken, verifyCustomer, AsyncError(bookingController.create));

router
  .route("/my")
  .get(verifyToken, verifyCustomer, AsyncError(bookingController.listCustomer));

router
  .route("/technician")
  .get(
    verifyToken,
    verifyTechnician,
    AsyncError(bookingController.listTechnician),
  );

router
  .route("/:bId/cancel")
  .put(verifyToken, verifyCustomer, AsyncError(bookingController.cancel));

router
  .route("/:bId/status")
  .put(
    verifyToken,
    verifyTechnician,
    AsyncError(bookingController.updateStatus),
  );

router
  .route("/:bId")
  .get(verifyToken, AsyncError(bookingController.get))
  .put(verifyToken, AsyncError(bookingController.update));

export default router;
