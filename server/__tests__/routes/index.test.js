const request = require("supertest");
const express = require("express");

const mockAuthRoutes = express.Router().get("/", (req, res) => res.json({ route: "auth" }));
const mockElectionRoutes = express.Router().get("/", (req, res) => res.json({ route: "election" }));
const mockOAuthRoutes = express.Router().get("/", (req, res) => res.json({ route: "oauth" }));
const mockRefreshRoute = express.Router().get("/", (req, res) => res.json({ route: "refresh" }));
const mockTimerRoutes = express.Router().get("/", (req, res) => res.json({ route: "timer" }));

jest.mock("../../routes/authRoutes", () => mockAuthRoutes);
jest.mock("../../routes/electionRoutes", () => mockElectionRoutes);
jest.mock("../../routes/oauthRoutes", () => mockOAuthRoutes);
jest.mock("../../routes/refreshTokenRoute", () => mockRefreshRoute);
jest.mock("../../routes/timerRoutes", () => mockTimerRoutes);

const indexRouter = require("../../routes/index");

const app = express();
app.use(indexRouter);

describe("index.js routes", () => {
  it("should mount /auth routes", async () => {
    const res = await request(app).get("/auth");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "auth" });
  });

  it("should mount /oauth routes", async () => {
    const res = await request(app).get("/oauth");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "oauth" });
  });

  it("should mount /election routes", async () => {
    const res = await request(app).get("/election");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "election" });
  });

  it("should mount /timer routes", async () => {
    const res = await request(app).get("/timer");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "timer" });
  });

  it("should mount /token routes", async () => {
    const res = await request(app).get("/token");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "refresh" });
  });
});
