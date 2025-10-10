import { createTimerService } from "../../services/timerService";

describe("timerService", () => {
  let Timer: any;
  let timerService: ReturnType<typeof createTimerService>;

  beforeEach(() => {
    Timer = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    };

    timerService = createTimerService(Timer);
    jest.clearAllMocks();
  });

  describe("getAllTimers", () => {
    it("should return timers as JSON when raw=false", async () => {
      const mockTimers = [
        {
          toJSON: jest
            .fn()
            .mockReturnValue({ timer_id: "1", startDate: "2025-01-01" }),
        },
        {
          toJSON: jest
            .fn()
            .mockReturnValue({ timer_id: "2", startDate: "2025-01-02" }),
        },
      ];
      Timer.findAll.mockResolvedValue(mockTimers);

      const result = await timerService.getAllTimers();

      expect(Timer.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { timer_id: "1", startDate: "2025-01-01" },
        { timer_id: "2", startDate: "2025-01-02" },
      ]);
    });

    it("should return raw timers when raw=true", async () => {
      const mockTimers = [
        { get: jest.fn().mockReturnValue({ timer_id: "1" }) },
        { get: jest.fn().mockReturnValue({ timer_id: "2" }) },
      ];
      Timer.findAll.mockResolvedValue(mockTimers);

      const result = await timerService.getAllTimers({ raw: true });

      expect(Timer.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([{ timer_id: "1" }, { timer_id: "2" }]);
    });

    it("should handle empty timers array", async () => {
      Timer.findAll.mockResolvedValue([]);

      const result = await timerService.getAllTimers();

      expect(Timer.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  describe("findTimerById", () => {
    it("should return timer as JSON when found", async () => {
      const mockData = { timer_id: "t1", startDate: "2025-01-10" };
      const mockRecord = { toJSON: jest.fn().mockReturnValue(mockData) };
      Timer.findOne.mockResolvedValue(mockRecord);

      const result = await timerService.findTimerById("t1");

      expect(Timer.findOne).toHaveBeenCalledWith({ where: { timer_id: "t1" } });
      expect(mockRecord.toJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it("should return undefined when timer not found", async () => {
      Timer.findOne.mockResolvedValue(null);

      const result = await timerService.findTimerById("unknown");

      expect(Timer.findOne).toHaveBeenCalledWith({
        where: { timer_id: "unknown" },
      });
      expect(result).toBeUndefined();
    });
  });

  describe("createTimer", () => {
    it("should create a timer and return it", async () => {
      const newTimer = {
        election_id: "e1",
        startDate: new Date("2025-02-01"),
        endDate: new Date("2025-02-05"),
      };
      const mockCreated = { timer_id: "t1", ...newTimer };
      Timer.create.mockResolvedValue(mockCreated);

      const result = await timerService.createTimer(newTimer);

      expect(Timer.create).toHaveBeenCalledWith(newTimer);
      expect(result).toBe(mockCreated);
    });
  });

  describe("updateExistingTimer", () => {
    it("should set update fields and save the timer", async () => {
      const mockTimer = { set: jest.fn(), save: jest.fn() };
      const update = { endDate: new Date("2025-03-01") };

      await timerService.updateExistingTimer(mockTimer as any, update);

      expect(mockTimer.set).toHaveBeenCalledWith(update);
      expect(mockTimer.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("clearTimer", () => {
    it("should destroy timers with truncate option", async () => {
      Timer.destroy.mockResolvedValue(1);

      const result = await timerService.clearTimer();

      expect(Timer.destroy).toHaveBeenCalledWith({ truncate: true });
      expect(result).toBe(1);
    });
  });
});
