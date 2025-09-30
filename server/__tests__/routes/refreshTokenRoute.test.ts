const request = require("supertest");
const express = require("express");

jest.mock("../../controllers/refreshTokenController", () => ({
  refreshToken: jest.fn((req, res) => res.status(200).json({ refreshed: true })),
}));

const refreshTokenController = require("../../controllers/refreshTokenController");
const refreshTokenRoute = require("../../routes/refreshTokenRoute");

const app = express();
app.use(express.json());
app.use(refreshTokenRoute);

describe("refreshTokenRoute", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /refresh calls refreshToken controller", async () => {
    const res = await request(app).post("/refresh").send({ token: "oldToken" });

    expect(refreshTokenController.refreshToken).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ refreshed: true });
  });
});
