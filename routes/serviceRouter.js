import express from "express";
const router = express.Router();
import { verifyTechnician, verifyToken } from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";

import serviceController from "../controllers/serviceController.js";

router
  .route("/")
  .get(AsyncError(serviceController.list))
  .post(verifyToken, verifyTechnician, AsyncError(serviceController.create));

router.route("/featured").get(AsyncError(serviceController.listFeatured));
router
  .route("/technician")
  .get(
    verifyToken,
    verifyTechnician,
    AsyncError(serviceController.listTechnician),
  );

router
  .route("/:sId")
  .get(AsyncError(serviceController.get))
  .put(verifyToken, verifyTechnician, AsyncError(serviceController.update))
  .delete(verifyToken, verifyTechnician, AsyncError(serviceController.destroy));

router
  .route("/:sId/availability")
  .put(
    verifyToken,
    verifyTechnician,
    AsyncError(serviceController.updateAvailability),
  );

export default router;
