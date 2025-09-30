const request = require("supertest");
const express = require("express");

jest.mock("../../controllers/oAuthController", () => ({
  googleOauthStart: jest.fn((req, res) => res.status(200).json({ route: "google-start" })),
  googleOauthConclude: jest.fn((req, res) => res.status(200).json({ route: "google-conclude" })),
  facebookOauthStart: jest.fn((req, res) => res.status(200).json({ route: "facebook-start" })),
  facebookOauthConclude: jest.fn((req, res) => res.status(200).json({ route: "facebook-conclude" })),
  githubOauthStart: jest.fn((req, res) => res.status(200).json({ route: "github-start" })),
  githubOauthConclude: jest.fn((req, res) => res.status(200).json({ route: "github-conclude" })),
  getUserDetailsOnOauthSuccess: jest.fn((req, res) => res.status(200).json({ user: "mock-user" })),
}));

const mockCheckAuth = jest.fn((req, res, next) => next());
jest.mock("../../middleware/auth", () => ({
  checkAuthenticationStatus: (...args) => mockCheckAuth(...args),
}));

const oAuthController = require("../../controllers/oAuthController");
const oauthRoutes = require("../../routes/oauthRoutes");

const app = express();
app.use(oauthRoutes);

describe("oauthRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /google calls googleOauthStart", async () => {
    const res = await request(app).get("/google");

    expect(oAuthController.googleOauthStart).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "google-start" });
  });

  it("GET /google/callback calls googleOauthConclude", async () => {
    const res = await request(app).get("/google/callback");

    expect(oAuthController.googleOauthConclude).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "google-conclude" });
  });

  it("GET /facebook calls facebookOauthStart", async () => {
    const res = await request(app).get("/facebook");

    expect(oAuthController.facebookOauthStart).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "facebook-start" });
  });

  it("GET /facebook/callback calls facebookOauthConclude", async () => {
    const res = await request(app).get("/facebook/callback");

    expect(oAuthController.facebookOauthConclude).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "facebook-conclude" });
  });

  it("GET /github calls githubOauthStart", async () => {
    const res = await request(app).get("/github");

    expect(oAuthController.githubOauthStart).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "github-start" });
  });

  it("GET /github/callback calls githubOauthConclude", async () => {
    const res = await request(app).get("/github/callback");

    expect(oAuthController.githubOauthConclude).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ route: "github-conclude" });
  });

  it("GET /me calls checkAuthenticationStatus and getUserDetailsOnOauthSuccess", async () => {
    const res = await request(app).get("/me");

    expect(mockCheckAuth).toHaveBeenCalled();
    expect(oAuthController.getUserDetailsOnOauthSuccess).toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: "mock-user" });
  });
});
