import express from "express";
const router = express.Router();

import { AsyncError, ExpressError } from "../utils/errorHandler.js";
import indexController from "../controllers/indexController.js";
import { verifyToken } from "../middlewares/authValidate.js";

router.route("/").get(indexController.getHome);
router
  .route("/my-services")
  .get(verifyToken, AsyncError(indexController.getMyServices));

export default router;
