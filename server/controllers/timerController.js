const { timerService } = require("../services");
const generateCustomError = require("../utils/generateCustomError");

const setTimer = async (req, res) => {
  const { startDate, endDate } = req.body;
  if (!startDate || !endDate) {
    generateCustomError("Start and end dates must be set!", 400);
  }
  const timers = await timerService.getAllTimers();
  if (timers.length === 0) {
    await timerService.createTimer(req.body);
  } else {
    await timerService.updateExistingTimer(timers[0], req.body);
  }
  res.json({ startDate, endDate });
};

const getTimerStatus = async (req, res) => {
  const timers = await timerService.getAllTimers();
  let timerObj;
  const timer = timers[0];
  if (timers.length === 0) {
    timerObj = {};
  } else {
    timerObj = {
      startDate: timer.startDate ? new Date(timer.startDate).getTime() : timer.startDate,
      endDate: timer.endDate ? new Date(timer.endDate).getTime() : timer.endDate,
    };
  }
  res.json(timerObj);
};

const cancelTimer = async (req, res) => {
  await timerService.clearTimer();
  res.json({});
};

module.exports = { setTimer, getTimerStatus, cancelTimer };
