import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/authValidate.js";
import { AsyncError } from "../utils/errorHandler.js";

import serviceController from "../controllers/serviceController.js";

router
  .route("/")
  .get(AsyncError(serviceController.index))
  .post(verifyToken, AsyncError(serviceController.store));

router.route("/seed").get(AsyncError(serviceController.seed));

router
  .route("/admin")
  .get(verifyToken, AsyncError(serviceController.indexAdmin));

router
  .route("/:sId")
  .get(AsyncError(serviceController.show))
  .put(verifyToken, AsyncError(serviceController.update))
  .delete(verifyToken, AsyncError(serviceController.destroy));

router
  .route("/:sId/status")
  .put(verifyToken, AsyncError(serviceController.status));

export default router;
