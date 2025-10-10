import express, { Express } from "express";
import request from "supertest";

jest.mock("../../middleware/auth", () => ({
  checkAuthenticationStatus: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => next(),
}));

jest.mock("../../controllers/oAuthController", () => ({
  googleOauthStart: jest.fn((req, res) =>
    res.status(200).json({ called: "googleOauthStart" }),
  ),
  googleOauthConclude: jest.fn((req, res) =>
    res.status(200).json({ called: "googleOauthConclude" }),
  ),
  facebookOauthStart: jest.fn((req, res) =>
    res.status(200).json({ called: "facebookOauthStart" }),
  ),
  facebookOauthConclude: jest.fn((req, res) =>
    res.status(200).json({ called: "facebookOauthConclude" }),
  ),
  githubOauthStart: jest.fn((req, res) =>
    res.status(200).json({ called: "githubOauthStart" }),
  ),
  githubOauthConclude: jest.fn((req, res) =>
    res.status(200).json({ called: "githubOauthConclude" }),
  ),
  getUserDetailsOnOauthSuccess: jest.fn((req, res) =>
    res.status(200).json({ called: "getUserDetailsOnOauthSuccess" }),
  ),
}));

import * as oAuthController from "../../controllers/oAuthController";
import oAuthRoutes from "../../routes/oauthRoutes";

describe("oAuthRoutes", () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/", oAuthRoutes);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const endpoints = [
    { path: "/google", handler: "googleOauthStart" },
    { path: "/google/callback", handler: "googleOauthConclude" },
    { path: "/facebook", handler: "facebookOauthStart" },
    { path: "/facebook/callback", handler: "facebookOauthConclude" },
    { path: "/github", handler: "githubOauthStart" },
    { path: "/github/callback", handler: "githubOauthConclude" },
    { path: "/me", handler: "getUserDetailsOnOauthSuccess" },
  ] as const;

  endpoints.forEach(({ path, handler }) => {
    it(`GET ${path} should call oAuthController.${handler}`, async () => {
      const res = await request(app).get(path);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ called: handler });
      expect(
        oAuthController[handler as keyof typeof oAuthController],
      ).toHaveBeenCalledTimes(1);
    });
  });
});
