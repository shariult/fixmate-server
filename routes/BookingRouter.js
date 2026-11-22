import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";

import bookingController from "../controllers/BookingController.js";

router.route("/").post(verifyToken, AsyncError(bookingController.store));

router
  .route("/:bId/cancel")
  .get(verifyToken, AsyncError(bookingController.cancel));

export default router;
