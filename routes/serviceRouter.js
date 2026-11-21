import express from "express";
const router = express.Router();
import serviceController from "../controllers/serviceController.js";
import { verifyToken } from "../middlewares/authValidate.js";

import { AsyncError } from "../utils/errorHandler.js";

router
  .route("/")
  .get(AsyncError(serviceController.index))
  .post(verifyToken, AsyncError(serviceController.store));

router
  .route("/:sId")
  .get(AsyncError(serviceController.show))
  .put(verifyToken, AsyncError(serviceController.update))
  .delete(verifyToken, AsyncError(serviceController.destroy));

router
  .route("/:sId/status")
  .put(verifyToken, AsyncError(serviceController.status));

router.route("/seed").get(AsyncError(serviceController.seed));

export default router;
