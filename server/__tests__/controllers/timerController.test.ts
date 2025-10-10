import type { Request, Response, NextFunction } from "express";
import { timerService } from "../../services";
import generateCustomError from "../../utils/generateCustomError";
import {
  setTimer,
  getTimerStatus,
  cancelTimer,
} from "../../controllers/timerController";

jest.mock("../../utils/generateCustomError", () => {
  const actual = jest.requireActual("../../utils/generateCustomError");
  return jest.fn(actual);
});

jest.mock("../../services", () => ({
  timerService: {
    getAllTimers: jest.fn(),
    createTimer: jest.fn(),
    updateExistingTimer: jest.fn(),
    clearTimer: jest.fn(),
  },
}));

describe("timerController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.MockedFunction<NextFunction>;

  beforeEach(() => {
    req = {
      body: {
        startDate: 1754816400000,
        endDate: 1754902800000,
      },
    };
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("setTimer", () => {
    it("forwards error to next when startDate/endDate missing", async () => {
      req.body = { startDate: undefined, endDate: undefined };

      // Make the mocked generateCustomError throw a CustomError-like object
      (generateCustomError as unknown as jest.Mock).mockImplementation(
        (msg: string, code: number) => {
          const err: any = new Error(msg);
          err.statusCode = code;
          throw err;
        },
      );

      await setTimer(req as Request, res as Response, next);

      // Assert: generateCustomError was called and next was called with the error
      expect(generateCustomError).toHaveBeenCalledWith(
        "Start and end dates must be set!",
        400,
      );
      expect(next).toHaveBeenCalledTimes(1);

      const errArg = (next as jest.Mock).mock.calls[0][0];
      expect(errArg).toEqual(
        expect.objectContaining({
          message: "Start and end dates must be set!",
          statusCode: 400,
        }),
      );

      // Ensure no service or response side-effects happened
      expect(timerService.getAllTimers as jest.Mock).not.toHaveBeenCalled();
      expect(timerService.createTimer as jest.Mock).not.toHaveBeenCalled();
      expect(
        timerService.updateExistingTimer as jest.Mock,
      ).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("creates a new timer when none exist", async () => {
      (timerService.getAllTimers as jest.Mock).mockResolvedValue([]);
      (timerService.createTimer as jest.Mock).mockResolvedValue(undefined);

      await setTimer(req as Request, res as Response, next);

      expect(timerService.getAllTimers).toHaveBeenCalledWith({ raw: true });
      expect(timerService.createTimer).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({
        startDate: req.body?.startDate,
        endDate: req.body?.endDate,
      });
    });

    it("updates an existing timer when one exists", async () => {
      const existing = { id: "1" };
      (timerService.getAllTimers as jest.Mock).mockResolvedValue([existing]);
      (timerService.updateExistingTimer as jest.Mock).mockResolvedValue(
        undefined,
      );

      await setTimer(req as Request, res as Response, next);

      expect(timerService.updateExistingTimer).toHaveBeenCalledWith(
        existing,
        req.body,
      );
      expect(res.json).toHaveBeenCalledWith({
        startDate: req.body?.startDate,
        endDate: req.body?.endDate,
      });
    });
  });

  describe("getTimerStatus", () => {
    it("returns {} when no timers exist", async () => {
      (timerService.getAllTimers as jest.Mock).mockResolvedValue([]);

      await getTimerStatus(req as Request, res as Response, next);

      expect(timerService.getAllTimers).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({});
    });

    it("returns timestamps when dates are present", async () => {
      const start = 1754816400000;
      const end = 1754902800000;
      (timerService.getAllTimers as jest.Mock).mockResolvedValue([
        { startDate: start, endDate: end },
      ]);

      await getTimerStatus(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        startDate: new Date(start).getTime(),
        endDate: new Date(end).getTime(),
      });
    });

    it("returns raw values when dates are falsy", async () => {
      (timerService.getAllTimers as jest.Mock).mockResolvedValue([
        { startDate: null, endDate: null },
      ]);

      await getTimerStatus(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ startDate: null, endDate: null });
    });
  });

  describe("cancelTimer", () => {
    it("clears timer and returns {}", async () => {
      (timerService.clearTimer as jest.Mock).mockResolvedValue(undefined);

      await cancelTimer(req as Request, res as Response, next);

      expect(timerService.clearTimer).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({});
    });

    it("forwards error to next when clearTimer throws", async () => {
      const mockError = new Error("DB failure");
      (timerService.clearTimer as jest.Mock).mockRejectedValue(mockError);

      await cancelTimer(req as Request, res as Response, next);

      expect(timerService.clearTimer).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(mockError);
    });
  });
});
