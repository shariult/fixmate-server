import express from "express";
const router = express.Router();
import userController from "../controllers/userController.js";
import { AsyncError } from "../utils/errorHandler.js";
import { verifyToken } from "../middlewares/authValidate.js";

router
  .route("/update-new-user")
  .get(verifyToken, AsyncError(userController.updateNewUser));

export default router;
