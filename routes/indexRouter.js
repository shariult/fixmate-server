import express from "express";
const router = express.Router();
import { AsyncError, ExpressError } from "../utils/errorHandler.js";
import { verifyToken } from "../middlewares/authValidate.js";

import indexController from "../controllers/indexController.js";

router.route("/").get(indexController.getHome);

router
  .route("/my-services")
  .get(verifyToken, AsyncError(indexController.getMyServices));

router
  .route("/my-bookings")
  .get(verifyToken, AsyncError(indexController.getMyBookings));

router
  .route("/my-requests")
  .get(verifyToken, AsyncError(indexController.getMyRequests));

export default router;
