const express = require("express");

const timerController = require("../controllers/timerController");
const { checkAuthorizationStatus } = require("../middleware/auth");

const router = express.Router();

router.use(express.json());

router.post("/set", checkAuthorizationStatus, timerController.setTimer);

router.get("/status", timerController.getTimerStatus);

router.delete("/cancel", checkAuthorizationStatus, timerController.cancelTimer);

module.exports = router;
