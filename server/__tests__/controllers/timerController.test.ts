const { timerService } = require("../../services");

jest.mock("../../utils/generateCustomError", () => {
  const actual = jest.requireActual("../../utils/generateCustomError");
  return jest.fn(actual);
});

const generateCustomError = require("../../utils/generateCustomError");

jest.mock("../../services", () => ({
  timerService: {
    getAllTimers: jest.fn(),
    createTimer: jest.fn(),
    updateExistingTimer: jest.fn(),
    clearTimer: jest.fn(),
  },
}));

const { setTimer, getTimerStatus, cancelTimer } = require("../../controllers/timerController");

describe("timerController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        startDate: 1754816400000,
        endDate: 1754902800000,
      },
    };
    res = { json: jest.fn() };
    jest.clearAllMocks();
  });

  describe("setTimer", () => {
    it("calls generateCustomError and rejects when startDate/endDate missing", async () => {
      req.body = { startDate: null, endDate: null };

      await expect(setTimer(req, res)).rejects.toMatchObject({
        message: "Start and end dates must be set!",
        statusCode: 400,
      });

      expect(generateCustomError).toHaveBeenCalledWith("Start and end dates must be set!", 400);
      expect(timerService.getAllTimers).not.toHaveBeenCalled();
      expect(timerService.createTimer).not.toHaveBeenCalled();
      expect(timerService.updateExistingTimer).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("creates a new timer when none exist", async () => {
      timerService.getAllTimers.mockResolvedValue([]);
      timerService.createTimer.mockResolvedValue();

      await setTimer(req, res);

      expect(timerService.getAllTimers).toHaveBeenCalledWith({ raw: true });
      expect(timerService.createTimer).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });
    });

    it("updates an existing timer when one exists", async () => {
      const existing = { id: 1 };
      timerService.getAllTimers.mockResolvedValue([existing]);
      timerService.updateExistingTimer.mockResolvedValue();

      await setTimer(req, res);

      expect(timerService.updateExistingTimer).toHaveBeenCalledWith(existing, req.body);
      expect(res.json).toHaveBeenCalledWith({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });
    });
  });

  describe("getTimerStatus", () => {
    it("returns {} when no timers exist", async () => {
      timerService.getAllTimers.mockResolvedValue([]);

      await getTimerStatus(req, res);

      expect(timerService.getAllTimers).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({});
    });

    it("returns timestamps when dates are present", async () => {
      const start = 1754816400000;
      const end = 1754902800000;
      timerService.getAllTimers.mockResolvedValue([{ startDate: start, endDate: end }]);

      await getTimerStatus(req, res);

      expect(res.json).toHaveBeenCalledWith({
        startDate: new Date(start).getTime(),
        endDate: new Date(end).getTime(),
      });
    });

    it("returns raw values when dates are falsy", async () => {
      timerService.getAllTimers.mockResolvedValue([{ startDate: null, endDate: null }]);

      await getTimerStatus(req, res);

      expect(res.json).toHaveBeenCalledWith({ startDate: null, endDate: null });
    });
  });

  describe("cancelTimer", () => {
    it("clears timer and returns {}", async () => {
      timerService.clearTimer.mockResolvedValue();

      await cancelTimer(req, res);

      expect(timerService.clearTimer).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({});
    });
  });
});
