const express = require("express");

const { checkAuthorizationStatus } = require("../middleware/auth");
const { Timer } = require("../models");
const router = express.Router();

router.use(express.json());

router.post("/set", checkAuthorizationStatus, async (req, res) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    throw new Error("Start and end dates must be set!");
  }
  const timer = await Timer.findAll();
  if (timer.length === 0) {
    await Timer.create(req.body);
  } else {
    const timerObj = timer[0];
    timerObj.set(req.body);
    await timerObj.save();
  }
  res.json({ startDate, endDate });
});

router.get("/cancel", checkAuthorizationStatus, async (req, res) => {
  await Timer.destroy({ truncate: true });
  res.json({});
});

router.get("/status", async (req, res) => {
  const electionTimer = await Timer.findAll();
  let electionObj;
  const timer = electionTimer[0];
  if (electionTimer.length === 0) {
    electionObj = {};
  } else {
    electionObj = {
      startDate: timer.startDate
        ? new Date(timer.startDate).getTime()
        : timer.startDate,
      endDate: timer.endDate
        ? new Date(timer.endDate).getTime()
        : timer.endDate,
    };
  }
  res.json(electionObj);
});

module.exports = router;
