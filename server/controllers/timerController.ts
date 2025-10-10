import { Request, Response, NextFunction } from "express";

import { Timer } from "../models/timer";
import type { TimerAttributes } from "../models/timer";
import { timerService } from "../services";
import generateCustomError from "../utils/generateCustomError";

/**
 * Create or update a timer.
 */
export const setTimer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.body as {
      startDate?: string | Date;
      endDate?: string | Date;
    };

    if (!startDate || !endDate) {
      generateCustomError("Start and end dates must be set!", 400);
    }

    // Fetch all timers (using raw for plain objects)
    const timers = (await timerService.getAllTimers({
      raw: true,
    })) as Timer[];

    if (timers.length === 0) {
      await timerService.createTimer(req.body);
    } else {
      await timerService.updateExistingTimer(timers[0], req.body);
    }

    res.json({ startDate, endDate });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the current timer status (start and end timestamps).
 */
export const getTimerStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const timers: TimerAttributes[] = await timerService.getAllTimers();
    const timer = timers[0];

    let timerObj: Partial<
      Record<
        keyof Pick<TimerAttributes, "startDate" | "endDate">,
        number | Date | undefined
      >
    >;

    if (!timer) {
      timerObj = {};
    } else {
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
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel and clear the timer.
 */
export const cancelTimer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await timerService.clearTimer();
    res.json({});
  } catch (error) {
    next(error);
  }
};
