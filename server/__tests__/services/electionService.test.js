const generateCustomError = require("../../utils/generateCustomError");
const {
  userHasVoted,
  getAllVotesForAPosition,
  getVotesForAContestant,
  getAllContestantsElectionDetails,
} = require("../../helpers/electionControllerHelpers");

jest.mock("../../utils/generateCustomError", () =>
  jest.fn((message, status) => {
    throw new Error(`${status}: ${message}`);
  }),
);

jest.mock("../../helpers/electionControllerHelpers", () => ({
  userHasVoted: jest.fn(),
  getAllVotesForAPosition: jest.fn(),
  getVotesForAContestant: jest.fn(),
  getAllContestantsElectionDetails: jest.fn(),
}));

describe("electionService", () => {
  let electionService;
  let votesService;
  let contestantsService;
  let timerService;

  beforeEach(() => {
    votesService = {
      getAllVotes: jest.fn(),
      castVote: jest.fn(),
      clearVotes: jest.fn(),
    };
    contestantsService = {
      createContestant: jest.fn(),
      findContestantById: jest.fn(),
      getAllContestants: jest.fn(),
    };
    timerService = {
      clearTimer: jest.fn(),
    };

    jest.clearAllMocks();

    electionService = require("../../services/electionService")({
      votesService,
      contestantsService,
      timerService,
    });
  });

  describe("createContestant", () => {
    it("should call contestantsService.createContestant with provided data", async () => {
      const contestantData = { name: "John" };
      contestantsService.createContestant.mockResolvedValue(contestantData);

      const result = await electionService.createContestant(contestantData);

      expect(contestantsService.createContestant).toHaveBeenCalledWith(contestantData);
      expect(result).toEqual(contestantData);
    });
  });

  describe("findContestant", () => {
    it("should call contestantsService.findContestantById", async () => {
      const contestant = { id: 1 };
      contestantsService.findContestantById.mockResolvedValue(contestant);

      const result = await electionService.findContestant("123");

      expect(contestantsService.findContestantById).toHaveBeenCalledWith("123");
      expect(result).toEqual(contestant);
    });
  });

  describe("getElectionSummary", () => {
    it("should throw error if no contestants", async () => {
      contestantsService.getAllContestants.mockResolvedValue([]);
      votesService.getAllVotes.mockResolvedValue([]);

      await expect(electionService.getElectionSummary()).rejects.toThrow(
        "404: There Is Currently No Election",
      );

      expect(generateCustomError).toHaveBeenCalledWith("There Is Currently No Election", 404);
    });

    it("should return grouped election details", async () => {
      const contestants = [{ id: 1 }];
      const votes = [{ id: 2 }];
      contestantsService.getAllContestants.mockResolvedValue(contestants);
      votesService.getAllVotes.mockResolvedValue(votes);

      const mockDetails = { grouped: true };
      getAllContestantsElectionDetails.mockReturnValue(mockDetails);

      const result = await electionService.getElectionSummary();

      expect(getAllContestantsElectionDetails).toHaveBeenCalledWith({
        contestants,
        votes,
      });
      expect(result).toBe(mockDetails);
    });
  });

  describe("castVote", () => {
    it("should throw error if user already voted", async () => {
      userHasVoted.mockReturnValue(true);
      await expect(electionService.castVote("user1", "contestant1", "president")).rejects.toThrow(
        "403: User has already voted",
      );

      expect(generateCustomError).toHaveBeenCalledWith("User has already voted", 403);
      expect(votesService.castVote).not.toHaveBeenCalled();
    });

    it("should cast vote and return position and contestant votes", async () => {
      const initialVotes = [{ id: 1 }];
      const finalVotes = [{ id: 1 }, { id: 2 }];
      votesService.getAllVotes
        .mockResolvedValueOnce(initialVotes) // before vote
        .mockResolvedValueOnce(finalVotes); // after vote
      userHasVoted.mockReturnValue(false);

      getAllVotesForAPosition.mockReturnValue("posVotes");
      getVotesForAContestant.mockReturnValue("contestantVotes");

      const result = await electionService.castVote("user1", "contestant1", "president");

      expect(votesService.castVote).toHaveBeenCalledWith({
        userId: "user1",
        contestantId: "contestant1",
        position: "president",
      });
      expect(result).toEqual({
        positionVotes: "posVotes",
        contestantVotes: "contestantVotes",
      });
    });
  });

  describe("clearElectionData", () => {
    it("should clear votes and timer", async () => {
      await electionService.clearElectionData();

      expect(votesService.clearVotes).toHaveBeenCalled();
      expect(timerService.clearTimer).toHaveBeenCalled();
    });
  });
});
