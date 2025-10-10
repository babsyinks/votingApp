import express, { Express, RequestHandler } from "express";
import request from "supertest";
import type * as ElectionControllerType from "../../controllers/electionController";
import electionRoutes from "../../routes/electionRoutes";

const stack: string[] = [];

jest.mock("../../middleware/uploadMedia", () => ({
  upload: {
    single: (pic: string): RequestHandler => {
      stack.push(pic);
      return (_req, _res, next) => next();
    },
  },
}));

jest.mock("../../controllers/electionController", () => ({
  addNewContestant: jest.fn((_req, res) =>
    res.status(201).json({ success: true }),
  ),
  getElectionDetails: jest.fn((_req, res) =>
    res.status(200).json({ details: true }),
  ),
  castVote: jest.fn((_req, res) => res.status(200).json({ vote: true })),
  deleteElection: jest.fn((_req, res) => res.status(204).send()),
}));

jest.mock("../../middleware/auth", () => ({
  checkAuthenticationStatus: (_req: any, _res: any, next: any) => next(),
  checkAuthorizationStatus: (_req: any, _res: any, next: any) => next(),
}));

const electionController = jest.requireMock(
  "../../controllers/electionController",
) as jest.Mocked<typeof ElectionControllerType>;

let app: Express;

beforeAll(() => {
  app = express();
  app.use(express.json());
  app.use(electionRoutes);
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("electionRoutes", () => {
  describe("POST /contestants", () => {
    it("should register upload.single middleware with 'picture' and call addNewContestant", async () => {
      expect(stack).toEqual(["picture"]);

      const res = await request(app)
        .post("/contestants")
        .field("name", "John Doe");

      expect(electionController.addNewContestant).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(201);
      expect(res.body).toEqual({ success: true });
    });
  });

  describe("GET /details", () => {
    it("should call getElectionDetails controller", async () => {
      const res = await request(app).get("/details");

      expect(electionController.getElectionDetails).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ details: true });
    });
  });

  describe("POST /vote", () => {
    it("should call castVote controller", async () => {
      const res = await request(app).post("/vote").send({ contestantId: 1 });

      expect(electionController.castVote).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ vote: true });
    });
  });

  describe("DELETE /delete", () => {
    it("should call deleteElection controller", async () => {
      const res = await request(app).delete("/delete");

      expect(electionController.deleteElection).toHaveBeenCalledTimes(1);
      expect(res.status).toBe(204);
      expect(res.text).toBe("");
    });
  });
});
