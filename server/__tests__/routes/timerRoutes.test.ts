const request = require("supertest");
const express = require("express");

jest.mock("../../controllers/timerController", () => ({
  setTimer: jest.fn((req, res) => res.status(200).json({ message: "Timer set" })),
  getTimerStatus: jest.fn((req, res) => res.status(200).json({ status: "running" })),
  cancelTimer: jest.fn((req, res) => res.status(200).json({ message: "Timer cancelled" })),
}));

jest.mock("../../middleware/auth", () => ({
  checkAuthorizationStatus: jest.fn((req, res, next) => next()),
}));

const timerController = require("../../controllers/timerController");
const { checkAuthorizationStatus } = require("../../middleware/auth");
const timerRoutes = require("../../routes/timerRoutes");

const app = express();
app.use(express.json());
app.use(timerRoutes);

describe("timerRoutes", () => {
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
