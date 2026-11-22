import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";

import bookingController from "../controllers/BookingController.js";

router.route("/").post(verifyToken, AsyncError(bookingController.store));

router
  .route("/:bId")
  .get(verifyToken, AsyncError(bookingController.show))
  .put(verifyToken, AsyncError(bookingController.update));

router
  .route("/:bId/cancel")
  .get(verifyToken, AsyncError(bookingController.cancel));

router
  .route("/:bId/status")
  .put(verifyToken, AsyncError(bookingController.status));

export default router;
