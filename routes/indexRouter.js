import express from "express";
const router = express.Router();
import { AsyncError, ExpressError } from "../utils/errorHandler.js";
import {
  verifyAdmin,
  verifyCustomer,
  verifyTechnician,
  verifyToken,
} from "../middlewares/authValidate.js";

import indexController from "../controllers/indexController.js";

router.route("/").get(indexController.getHome);

router.route("/seed").get(AsyncError(indexController.seed));

router
  .route("/api/dashboard/customer")
  .get(
    verifyToken,
    verifyCustomer,
    AsyncError(indexController.getCustomerDash),
  );

router
  .route("/api/dashboard/technician")
  .get(
    verifyToken,
    verifyTechnician,
    AsyncError(indexController.getTechnicianDash),
  );

router
  .route("/api/dashboard/admin")
  .get(verifyToken, verifyAdmin, AsyncError(indexController.getAdminDash));
export default router;
