import express from "express";
const router = express.Router();

import { AsyncError, ExpressError } from "../utils/errorHandler.js";
import indexController from "../controllers/indexController.js";

router.route("/").get(indexController.getHome);

export default router;
