import express from "express";
const router = express.Router();
import { AsyncError } from "../utils/errorHandler.js";
import { verifyToken } from "../middlewares/authValidate.js";

import userController from "../controllers/userController.js";

router
  .route("/update-new-user")
  .get(verifyToken, AsyncError(userController.updateNewUser));

export default router;
