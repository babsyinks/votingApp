const electionController = require("../../controllers/electionController");
const { electionService } = require("../../services");

jest.mock("../../services", () => ({
  electionService: {
    createContestant: jest.fn(),
    getElectionSummary: jest.fn(),
    castVote: jest.fn(),
    clearElectionData: jest.fn(),
  },
}));

describe("electionController", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, file: {}, user: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("addNewContestant", () => {
    it("should return 400 if no file is uploaded", async () => {
      req.file = null;

      await electionController.addNewContestant(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" });
    });

    it("should create contestant and return 201", async () => {
      req.file = { path: "path/to/file.jpg" };
      req.body = {
        surname: "Doe",
        firstName: "John",
        post: "President",
        manifesto: "My vision...",
      };
      const newContestant = { id: 1, surname: "Doe" };
      electionService.createContestant.mockResolvedValue(newContestant);

      await electionController.addNewContestant(req, res, next);

      expect(electionService.createContestant).toHaveBeenCalledWith({
        surname: "Doe",
        firstname: "John",
        position: "President",
        manifesto: "My vision...",
        picture: "path/to/file.jpg",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "success",
        contestant: newContestant,
      });
    });

    it("should call next on error", async () => {
      req.file = { path: "pic.jpg" };
      electionService.createContestant.mockRejectedValue(new Error("DB fail"));

      await electionController.addNewContestant(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getElectionDetails", () => {
    it("should return election summary with user info", async () => {
      req.user = { user_id: 5, username: "john", role: "voter" };
      electionService.getElectionSummary.mockResolvedValue({ totalVotes: 100 });

      await electionController.getElectionDetails(req, res, next);

      expect(electionService.getElectionSummary).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        electionData: { totalVotes: 100 },
        userId: 5,
        username: "john",
        role: "voter",
      });
    });

    it("should call next on error", async () => {
      electionService.getElectionSummary.mockRejectedValue(new Error("DB fail"));

      await electionController.getElectionDetails(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("castVote", () => {
    it("should return 400 if request is malformed", async () => {
      req.body = { userId: 1, contestantId: null, position: "President" };

      await electionController.castVote(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "malformed request" });
    });

    it("should cast vote and return updated vote counts", async () => {
      req.body = { userId: 1, contestantId: 2, position: "President" };
      electionService.castVote.mockResolvedValue({
        positionVotes: 10,
        contestantVotes: 4,
      });

      await electionController.castVote(req, res, next);

      expect(electionService.castVote).toHaveBeenCalledWith(1, 2, "President");
      expect(res.json).toHaveBeenCalledWith({
        positionVotes: 10,
        contestantVotes: 4,
      });
    });

    it("should call next on error", async () => {
      req.body = { userId: 1, contestantId: 2, position: "President" };
      electionService.castVote.mockRejectedValue(new Error("Vote fail"));

      await electionController.castVote(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("deleteElection", () => {
    it("should clear election data and return success", async () => {
      await electionController.deleteElection(req, res, next);

      expect(electionService.clearElectionData).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "success" });
    });

    it("should call next on error", async () => {
      electionService.clearElectionData.mockRejectedValue(new Error("Delete fail"));

      await electionController.deleteElection(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
