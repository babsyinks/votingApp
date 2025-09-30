describe("timerService", () => {
  let Timer;
  let timerService;

  beforeEach(() => {
    Timer = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    };

    timerService = require("../../services/timerService")(Timer);
    jest.clearAllMocks();
  });

  describe("getAllTimers", () => {
    it("should return timers as JSON when raw=false", async () => {
      const mockTimers = [
        { toJSON: jest.fn().mockReturnValue({ id: 1, startDate: "2025-01-01" }) },
        { toJSON: jest.fn().mockReturnValue({ id: 2, startDate: "2025-01-02" }) },
      ];
      Timer.findAll.mockResolvedValue(mockTimers);

      const result = await timerService.getAllTimers();

      expect(Timer.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { id: 1, startDate: "2025-01-01" },
        { id: 2, startDate: "2025-01-02" },
      ]);
    });

    it("should return raw timers when raw=true", async () => {
      const mockTimers = [
        { id: 1, startDate: "2025-01-01" },
        { id: 2, startDate: "2025-01-02" },
      ];
      Timer.findAll.mockResolvedValue(mockTimers);

      const result = await timerService.getAllTimers({ raw: true });

      expect(result).toEqual(mockTimers);
    });

    it("should handle empty timers array", async () => {
      Timer.findAll.mockResolvedValue([]);

      const result = await timerService.getAllTimers();

      expect(result).toEqual([]);
    });
  });

  describe("findTimerById", () => {
    it("should return timer as JSON when found", async () => {
      const mockData = { id: 5, startDate: "2025-01-10" };
      Timer.findOne.mockResolvedValue({ toJSON: jest.fn().mockReturnValue(mockData) });

      const result = await timerService.findTimerById(5);

      expect(Timer.findOne).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(result).toEqual(mockData);
    });

    it("should return undefined when timer not found", async () => {
      Timer.findOne.mockResolvedValue(null);

      const result = await timerService.findTimerById(123);

      expect(result).toBeUndefined();
    });
  });

  describe("createTimer", () => {
    it("should create a timer and return it", async () => {
      const newTimer = { startDate: "2025-02-01", endDate: "2025-02-05" };
      const mockCreated = { id: 1, ...newTimer };
      Timer.create.mockResolvedValue(mockCreated);

      const result = await timerService.createTimer(newTimer);

      expect(Timer.create).toHaveBeenCalledWith(newTimer);
      expect(result).toBe(mockCreated);
    });
  });

  describe("updateExistingTimer", () => {
    it("should set update fields and save the timer", async () => {
      const mockTimer = { set: jest.fn(), save: jest.fn() };
      const update = { endDate: "2025-03-01" };

      await timerService.updateExistingTimer(mockTimer, update);

      expect(mockTimer.set).toHaveBeenCalledWith(update);
      expect(mockTimer.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("clearTimer", () => {
    it("should destroy timers with truncate option", async () => {
      Timer.destroy.mockResolvedValue();

      await timerService.clearTimer();

      expect(Timer.destroy).toHaveBeenCalledWith({ truncate: true });
    });
  });
});
