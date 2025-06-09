const express = require("express");

const checkAdminAuthorization = require("../middleware/auth/checkAdminAuthorization");
const { Timer } = require("../models");
const Router = express.Router();

Router.use(express.json());

Router.post("/set", checkAdminAuthorization, async (req, res) => {
  try {
    const timer = await Timer.findAll();
    const { startDate, endDate } = req.body;
    if (timer.length === 0) {
      await Timer.create(req.body);
    } else {
      const timerObj = timer[0];
      timerObj.set(req.body);
      await timerObj.save();
    }
    res.json({ startDate, endDate });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

Router.get("/cancel", checkAdminAuthorization, async (req, res) => {
  try {
    await Timer.destroy({ truncate: true });
    res.json({});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

Router.get("/cancelStart", async (req, res) => {
  try {
    const timer = await Timer.findAll();
    const timerObj = timer[0];
    timerObj.set({ startDate: null });
    await timerObj.save();
    res.json(timerObj);
  } catch (error) {
    res.json({ message: error.message });
  }
});

Router.get("/status", async (req, res) => {
  try {
    const electionTimer = await Timer.findAll();
    let electionObj;
    const electionDataValues = electionTimer[0]?.dataValues;
    const timerNotSet =
      !electionDataValues?.startDate && !electionDataValues?.endDate;
    if (electionTimer.length === 0) {
      electionObj = {};
    } else if (timerNotSet) {
      electionObj = { startDate: null, endDate: null };
    } else {
      electionObj = {
        startDate: electionDataValues.startDate
          ? new Date(electionDataValues.startDate).getTime()
          : electionDataValues.startDate,
        endDate: electionDataValues.endDate
          ? new Date(electionDataValues.endDate).getTime()
          : electionDataValues.endDate,
      };
    }
    res.json(electionObj);
  } catch (error) {
    res.json({ message: error.message });
  }
});

Router.get("/end", async (req, res) => {
  try {
    const timer = await Timer.findAll();
    const timerObj = timer[0];
    timerObj.set({ endDate: null });
    await timerObj.save();
    res.json(timerObj);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
});

module.exports = Router;
