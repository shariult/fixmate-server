import express from "express";
const router = express.Router();
import { AsyncError, ExpressError } from "../utils/errorHandler.js";
import {
  verifyCustomer,
  verifyTechnician,
  verifyToken,
} from "../middlewares/authValidate.js";

import indexController from "../controllers/indexController.js";

router.route("/").get(indexController.getHome);

router
  .route("/my-services")
  .get(
    verifyToken,
    verifyTechnician,
    AsyncError(indexController.getMyServices),
  );

router
  .route("/my-bookings")
  .get(verifyToken, verifyCustomer, AsyncError(indexController.getMyBookings));

router
  .route("/my-requests")
  .get(
    verifyToken,
    verifyTechnician,
    AsyncError(indexController.getMyRequests),
  );

router.route("/seed").get(AsyncError(indexController.seed));

export default router;
