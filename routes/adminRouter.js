import express from "express";
const router = express.Router();
import {
  verifyAdmin,
  verifyCustomer,
  verifyTechnician,
  verifyToken,
} from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";
import adminController from "../controllers/adminController.js";

router
  .route("/users")
  .get(verifyToken, verifyAdmin, AsyncError(adminController.listUsers));

router
  .route("/bookings")
  .get(verifyToken, verifyAdmin, AsyncError(adminController.listBookings));

router
  .route("/payments")
  .get(verifyToken, verifyAdmin, AsyncError(adminController.listPayments));

router
  .route("/users/:uId/role")
  .put(verifyToken, verifyAdmin, AsyncError(adminController.updateUserRole));

router
  .route("/services")
  .get(verifyToken, verifyAdmin, AsyncError(adminController.listServices));

router
  .route("/services/:sId/approval")
  .put(
    verifyToken,
    verifyAdmin,
    AsyncError(adminController.updateServiceApproval),
  );

export default router;
