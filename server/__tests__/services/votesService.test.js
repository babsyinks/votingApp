describe("votesService", () => {
  let Votes;
  let votesService;

  beforeEach(() => {
    Votes = {
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    };
    votesService = require("../../services/votesService")(Votes);
    jest.clearAllMocks();
  });

  describe("getAllVotes", () => {
    it("should return all votes as JSON", async () => {
      const mockVotes = [
        { toJSON: jest.fn().mockReturnValue({ id: 1, position: "president" }) },
        { toJSON: jest.fn().mockReturnValue({ id: 2, position: "vice president" }) },
      ];
      Votes.findAll.mockResolvedValue(mockVotes);

      const result = await votesService.getAllVotes();

      expect(Votes.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { id: 1, position: "president" },
        { id: 2, position: "vice president" },
      ]);
    });

    it("should handle empty votes list", async () => {
      Votes.findAll.mockResolvedValue([]);

      const result = await votesService.getAllVotes();

      expect(result).toEqual([]);
    });
  });

  describe("castVote", () => {
    it("should create a vote with correct fields", async () => {
      const voteData = {
        userId: "user123",
        contestantId: "cont456",
        position: "treasurer",
      };
      const mockCreatedVote = { id: 99, ...voteData };
      Votes.create.mockResolvedValue(mockCreatedVote);

      const result = await votesService.castVote(voteData);

      expect(Votes.create).toHaveBeenCalledWith({
        user_id: "user123",
        contestant_id: "cont456",
        position: "treasurer",
      });
      expect(result).toBe(mockCreatedVote);
    });
  });

  describe("clearVotes", () => {
    it("should delete all votes with truncate", async () => {
      Votes.destroy.mockResolvedValue();

      await votesService.clearVotes();

      expect(Votes.destroy).toHaveBeenCalledWith({ truncate: true });
    });
  });
});
