const request = require("supertest");
const express = require("express");

const stack = [];

jest.mock("../../middleware/uploadMedia", () => {
  return {
    upload: {
      single: (pic) => {
        stack.push(pic);
        return (req, res, next) => next();
      },
    },
  };
});

jest.mock("../../controllers/electionController", () => ({
  addNewContestant: jest.fn((req, res) => res.status(201).json({ success: true })),
  getElectionDetails: jest.fn((req, res) => res.status(200).json({ details: true })),
  castVote: jest.fn((req, res) => res.status(200).json({ vote: true })),
  deleteElection: jest.fn((req, res) => res.status(204).send()),
}));

jest.mock("../../middleware/auth", () => ({
  checkAuthenticationStatus: (req, res, next) => next(),
  checkAuthorizationStatus: (req, res, next) => next(),
}));

const electionController = require("../../controllers/electionController");
const electionRoutes = require("../../routes/electionRoutes");

const app = express();
app.use(electionRoutes);

describe("electionRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /contestants", () => {
    it("should register upload.single middleware with 'picture' and call addNewContestant", async () => {
      expect(stack).toEqual(["picture"]);
      const res = await request(app).post("/contestants").field("name", "John Doe");

      expect(electionController.addNewContestant).toHaveBeenCalled();
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe("GET /details", () => {
    it("should call getElectionDetails controller", async () => {
      const res = await request(app).get("/details");

      expect(electionController.getElectionDetails).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ details: true });
    });
  });

  describe("POST /vote", () => {
    it("should call castVote controller", async () => {
      const res = await request(app).post("/vote").send({ contestantId: 1 });

      expect(electionController.castVote).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ vote: true });
    });
  });

  describe("DELETE /delete", () => {
    it("should call deleteElection controller", async () => {
      const res = await request(app).delete("/delete");

      expect(electionController.deleteElection).toHaveBeenCalled();
      expect(res.status).toBe(204);
      expect(res.text).toBe("");
    });
  });
});
