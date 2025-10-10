import { Request, Response, NextFunction } from "express";
import * as electionController  from "../../controllers/electionController";
import { electionService } from "../../services";
import type { AuthenticatedRequest } from "../../controllers/electionController";

jest.mock("../../services", () => ({
  electionService: {
    createContestant: jest.fn(),
    getElectionSummary: jest.fn(),
    castVote: jest.fn(),
    clearElectionData: jest.fn(),
  },
}));

describe("electionController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, file: {} as any, user: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("addNewContestant", () => {
    it("should return 400 if no file is uploaded", async () => {
      req.file = null as any;

      await electionController.addNewContestant(
        req as Request,
        res as Response,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" });
    });

    it("should create contestant and return 201", async () => {
      req.file = { path: "path/to/file.jpg" } as Express.Multer.File;
      req.body = {
        surname: "Doe",
        firstName: "John",
        post: "President",
        manifesto: "My vision...",
      };

      const newContestant = { id: '1', surname: "Doe" };
      (electionService.createContestant as jest.Mock).mockResolvedValue(
        newContestant,
      );

      await electionController.addNewContestant(
        req as Request,
        res as Response,
        next,
      );

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
      req.file = { path: "pic.jpg" } as Express.Multer.File;
      (electionService.createContestant as jest.Mock).mockRejectedValue(
        new Error("DB fail"),
      );

      await electionController.addNewContestant(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getElectionDetails", () => {
    it("should return election summary with user info", async () => {
      req.user = { user_id: '5', username: "john", role: "voter" } as any;
      (electionService.getElectionSummary as jest.Mock).mockResolvedValue({
        totalVotes: 100,
      });

      await electionController.getElectionDetails(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(electionService.getElectionSummary).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        electionData: { totalVotes: 100 },
        userId: '5',
        username: "john",
        role: "voter",
      });
    });

    it("should call next on error", async () => {
      (electionService.getElectionSummary as jest.Mock).mockRejectedValue(
        new Error("DB fail"),
      );

      await electionController.getElectionDetails(
        req as AuthenticatedRequest,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("castVote", () => {
    it("should return 400 if request is malformed", async () => {
      req.body = { userId: '1', contestantId: null, position: "President" };

      await electionController.castVote(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "malformed request" });
    });

    it("should cast vote and return updated vote counts", async () => {
      req.body = { userId: '1', contestantId: '2', electionId: '3', position: "President" };
      (electionService.castVote as jest.Mock).mockResolvedValue({
        positionVotes: 10,
        contestantVotes: 4,
      });

      await electionController.castVote(req as Request, res as Response, next);

      expect(electionService.castVote).toHaveBeenCalledWith('1', '2', "President", '3');
      expect(res.json).toHaveBeenCalledWith({
        positionVotes: 10,
        contestantVotes: 4,
      });
    });

    it("should call next on error", async () => {
      req.body = { userId: '1', contestantId: '2', electionId: '3', position: "President" };
      (electionService.castVote as jest.Mock).mockRejectedValue(
        new Error("Vote fail"),
      );

      await electionController.castVote(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("deleteElection", () => {
    it("should clear election data and return success", async () => {
      await electionController.deleteElection(
        req as Request,
        res as Response,
        next,
      );

      expect(electionService.clearElectionData).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "success" });
    });

    it("should call next on error", async () => {
      (electionService.clearElectionData as jest.Mock).mockRejectedValue(
        new Error("Delete fail"),
      );

      await electionController.deleteElection(
        req as Request,
        res as Response,
        next,
      );

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
