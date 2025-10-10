import generateCustomError from "../../utils/generateCustomError";
import {
  userHasVoted,
  getAllVotesForAPosition,
  getVotesForAContestant,
  getAllContestantsElectionDetails,
} from "../../helpers/electionControllerHelpers";
import createElectionService from "../../services/electionService";

// Mock dependencies
jest.mock("../../utils/generateCustomError", () =>
  jest.fn((message: string, status: number) => {
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
  let electionService: ReturnType<typeof createElectionService>;
  let votesService: any;
  let contestantsService: any;
  let timerService: any;

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

    electionService = createElectionService({
      votesService,
      contestantsService,
      timerService,
    });
  });

  describe("createContestant", () => {
    it("calls contestantsService.createContestant with provided data", async () => {
      const contestantData = {
        election_id: "elID",
        surname: "Kane",
        firstname: "John",
        position: "president",
        manifesto: "change",
        picture: "pix.jpeg",
      };
      contestantsService.createContestant.mockResolvedValue(contestantData);

      const result = await electionService.createContestant(contestantData);

      expect(contestantsService.createContestant).toHaveBeenCalledWith(
        contestantData,
      );
      expect(result).toEqual(contestantData);
    });
  });

  describe("findContestant", () => {
    it("calls contestantsService.findContestantById", async () => {
      const contestant = { id: 1 };
      contestantsService.findContestantById.mockResolvedValue(contestant);

      const result = await electionService.findContestant("123");

      expect(contestantsService.findContestantById).toHaveBeenCalledWith("123");
      expect(result).toEqual(contestant);
    });
  });

  describe("getElectionSummary", () => {
    it("returns empty array if no contestants", async () => {
      contestantsService.getAllContestants.mockResolvedValue([]);
      votesService.getAllVotes.mockResolvedValue([]);

      const result = await electionService.getElectionSummary();

      expect(result).toEqual([]);
    });

    it("returns grouped election details", async () => {
      const contestants = [{ id: 1 }];
      const votes = [{ id: 2 }];
      contestantsService.getAllContestants.mockResolvedValue(contestants);
      votesService.getAllVotes.mockResolvedValue(votes);

      const mockDetails = { grouped: true };
      (getAllContestantsElectionDetails as jest.Mock).mockReturnValue(
        mockDetails,
      );

      const result = await electionService.getElectionSummary();

      expect(getAllContestantsElectionDetails).toHaveBeenCalledWith({
        contestants,
        votes,
      });
      expect(result).toBe(mockDetails);
    });
  });

  describe("castVote", () => {
    it("throws an error if user already voted", async () => {
      (userHasVoted as jest.Mock).mockReturnValue(true);

      await expect(
        electionService.castVote("user1", "contestant1", "president", "ele1"),
      ).rejects.toThrow("403: User has already voted");

      expect(generateCustomError).toHaveBeenCalledWith(
        "User has already voted",
        403,
      );
      expect(votesService.castVote).not.toHaveBeenCalled();
    });

    it("casts vote and returns position and contestant votes", async () => {
      const initialVotes = [{ id: 1 }];
      const finalVotes = [{ id: 1 }, { id: 2 }];

      votesService.getAllVotes
        .mockResolvedValueOnce(initialVotes) // before vote
        .mockResolvedValueOnce(finalVotes); // after vote

      (userHasVoted as jest.Mock).mockReturnValue(false);
      (getAllVotesForAPosition as jest.Mock).mockReturnValue("posVotes");
      (getVotesForAContestant as jest.Mock).mockReturnValue("contestantVotes");

      const result = await electionService.castVote(
        "user1",
        "contestant1",
        "president",
        "ele1",
      );

      expect(votesService.castVote).toHaveBeenCalledWith({
        userId: "user1",
        contestantId: "contestant1",
        position: "president",
        electionId: "ele1",
      });
      expect(result).toEqual({
        positionVotes: "posVotes",
        contestantVotes: "contestantVotes",
      });
    });
  });

  describe("clearElectionData", () => {
    it("clears votes and timer", async () => {
      await electionService.clearElectionData();

      expect(votesService.clearVotes).toHaveBeenCalled();
      expect(timerService.clearTimer).toHaveBeenCalled();
    });
  });
});
