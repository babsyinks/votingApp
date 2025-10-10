import request from "supertest";
import express, { Express } from "express";

jest.mock("../../controllers/timerController", () => ({
  setTimer: jest.fn((req, res) =>
    res.status(200).json({ message: "Timer set" }),
  ),
  getTimerStatus: jest.fn((req, res) =>
    res.status(200).json({ status: "running" }),
  ),
  cancelTimer: jest.fn((req, res) =>
    res.status(200).json({ message: "Timer cancelled" }),
  ),
}));

jest.mock("../../middleware/auth", () => ({
  checkAuthorizationStatus: jest.fn((req, res, next) => next()),
}));

import * as timerController from "../../controllers/timerController";
import { checkAuthorizationStatus } from "../../middleware/auth";
import timerRoutes from "../../routes/timerRoutes";

describe("timerRoutes", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(timerRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /set", () => {
    it("should call checkAuthorizationStatus and setTimer", async () => {
      const res = await request(app).post("/set").send({ duration: 60 });

      expect(checkAuthorizationStatus).toHaveBeenCalled();
      expect(timerController.setTimer).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Timer set" });
    });
  });

  describe("GET /status", () => {
    it("should call getTimerStatus", async () => {
      const res = await request(app).get("/status");

      expect(timerController.getTimerStatus).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: "running" });
    });
  });

  describe("DELETE /cancel", () => {
    it("should call checkAuthorizationStatus and cancelTimer", async () => {
      const res = await request(app).delete("/cancel");

      expect(checkAuthorizationStatus).toHaveBeenCalled();
      expect(timerController.cancelTimer).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Timer cancelled" });
    });
  });
});
