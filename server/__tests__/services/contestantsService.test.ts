describe("contestantsService", () => {
  let Contestants;
  let contestantsService;

  beforeEach(() => {
    Contestants = {
      create: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
    };

    contestantsService = require("../../services/contestantsService")(Contestants);

    jest.clearAllMocks();
  });

  describe("createContestant", () => {
    it("should create a contestant and return the result", async () => {
      const data = { contestant_id: "c1", firstname: "John", surname: "Doe" };
      const mockResult = { id: 1, ...data };
      Contestants.create.mockResolvedValue(mockResult);

      const result = await contestantsService.createContestant(data);

      expect(Contestants.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockResult);
    });
  });

  describe("findContestantById", () => {
    it("should return contestant as JSON if found", async () => {
      const mockData = { id: 1, contestant_id: "c1" };
      const mockRecord = { toJSON: jest.fn().mockReturnValue(mockData) };
      Contestants.findOne.mockResolvedValue(mockRecord);

      const result = await contestantsService.findContestantById("c1");

      expect(Contestants.findOne).toHaveBeenCalledWith({
        where: { contestant_id: "c1" },
      });
      expect(mockRecord.toJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockData);
    });

    it("should return undefined if contestant not found", async () => {
      Contestants.findOne.mockResolvedValue(null);

      const result = await contestantsService.findContestantById("unknown");

      expect(result).toBeUndefined();
    });
  });

  describe("getAllContestants", () => {
    it("should return an array of contestants as JSON", async () => {
      const mockDataArray = [
        { id: 1, toJSON: jest.fn().mockReturnValue({ id: 1, name: "John" }) },
        { id: 2, toJSON: jest.fn().mockReturnValue({ id: 2, name: "Jane" }) },
      ];
      Contestants.findAll.mockResolvedValue(mockDataArray);

      const result = await contestantsService.getAllContestants();

      expect(Contestants.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ]);
    });

    it("should handle empty list", async () => {
      Contestants.findAll.mockResolvedValue([]);

      const result = await contestantsService.getAllContestants();

      expect(result).toEqual([]);
    });
  });
});
