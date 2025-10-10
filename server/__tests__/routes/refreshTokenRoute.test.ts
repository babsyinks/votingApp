import express, { Express } from "express";
import request from "supertest";

jest.mock("../../controllers/refreshTokenController", () => ({
  refreshToken: jest.fn((req, res) =>
    res.status(200).json({ refreshed: true }),
  ),
}));

import { refreshToken } from "../../controllers/refreshTokenController";
import refreshTokenRoute from "../../routes/refreshTokenRoute";

describe("refreshTokenRoute", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(refreshTokenRoute);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /refresh calls refreshToken controller", async () => {
    const res = await request(app).post("/refresh").send({ token: "oldToken" });

    expect(refreshToken).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ refreshed: true });
  });
});
