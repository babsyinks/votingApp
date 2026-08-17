"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelTimer = exports.getTimerStatus = exports.setTimer = void 0;
const services_1 = require("../services");
const generateCustomError_1 = __importDefault(require("../utils/generateCustomError"));
/**
 * Create or update a timer.
 */
const setTimer = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body;
        if (!startDate || !endDate) {
            (0, generateCustomError_1.default)("Start and end dates must be set!", 400);
        }
        // Fetch all timers (using raw for plain objects)
        const timers = (await services_1.timerService.getAllTimers({
            raw: true,
        }));
        if (timers.length === 0) {
            await services_1.timerService.createTimer(req.body);
        }
        else {
            await services_1.timerService.updateExistingTimer(timers[0], req.body);
        }
        res.json({ startDate, endDate });
    }
    catch (error) {
        next(error);
    }
};
exports.setTimer = setTimer;
/**
 * Get the current timer status (start and end timestamps).
 */
const getTimerStatus = async (req, res, next) => {
    try {
        const timers = await services_1.timerService.getAllTimers();
        const timer = timers[0];
        let timerObj;
        if (!timer) {
            timerObj = {};
        }
        else {
            timerObj = {
                startDate: timer.startDate
                    ? new Date(timer.startDate).getTime()
                    : timer.startDate,
                endDate: timer.endDate
                    ? new Date(timer.endDate).getTime()
                    : timer.endDate,
            };
        }
        res.json(timerObj);
    }
    catch (error) {
        next(error);
    }
};
exports.getTimerStatus = getTimerStatus;
/**
 * Cancel and clear the timer.
 */
const cancelTimer = async (req, res, next) => {
    try {
        await services_1.timerService.clearTimer();
        res.json({});
    }
    catch (error) {
        next(error);
    }
};
exports.cancelTimer = cancelTimer;
