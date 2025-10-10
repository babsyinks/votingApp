import express, { Router } from "express";

import * as timerController from "../controllers/timerController";
import { checkAuthorizationStatus } from "../middleware/auth";

const router: Router = express.Router();

router.use(express.json());

router.post("/set", checkAuthorizationStatus, timerController.setTimer);

router.get("/status", timerController.getTimerStatus);

router.delete("/cancel", checkAuthorizationStatus, timerController.cancelTimer);

export default router;
