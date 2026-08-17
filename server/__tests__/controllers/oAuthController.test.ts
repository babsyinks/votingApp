import { Request, Response, NextFunction } from "express";
import * as helpers from "../../helpers/oAuthHelpers";
import {
  googleOauthStart,
  googleOauthConclude,
  facebookOauthStart,
  facebookOauthConclude,
  githubOauthStart,
  githubOauthConclude,
  getUserDetailsOnOauthSuccess,
} from "../../controllers/oAuthController";

// Mock helpers
jest.mock("../../helpers/oAuthHelpers", () => ({
  passportCallbackWrapper: jest.fn(
    (provider: string) => `${provider}CallbackWrapper`,
  ),
  getOauthStartMiddleware: jest.fn(
    (provider: string, _config: object) => `${provider}StartMiddleware`,
  ),
}));

describe("oAuthController", () => {
  describe("Middleware creation (import-time)", () => {
    it("creates google start middleware with correct args", () => {
      expect(googleOauthStart).toBe("googleStartMiddleware");
      expect(helpers.getOauthStartMiddleware).toHaveBeenCalledWith("google", {
        scope: ["email", "profile"],
      });
    });

    it("creates google conclude middleware with correct args", () => {
      expect(googleOauthConclude).toBe("googleCallbackWrapper");
      expect(helpers.passportCallbackWrapper).toHaveBeenCalledWith("google");
    });

    it("creates facebook start middleware with correct args", () => {
      expect(facebookOauthStart).toBe("facebookStartMiddleware");
      expect(helpers.getOauthStartMiddleware).toHaveBeenCalledWith("facebook", {
        scope: ["email", "public_profile"],
      });
    });

    it("creates facebook conclude middleware with correct args", () => {
      expect(facebookOauthConclude).toBe("facebookCallbackWrapper");
      expect(helpers.passportCallbackWrapper).toHaveBeenCalledWith("facebook");
    });

    it("creates github start middleware with correct args", () => {
      expect(githubOauthStart).toBe("githubStartMiddleware");
      expect(helpers.getOauthStartMiddleware).toHaveBeenCalledWith("github", {
        scope: ["user:email", "read:user"],
      });
    });

    it("creates github conclude middleware with correct args", () => {
      expect(githubOauthConclude).toBe("githubCallbackWrapper");
      expect(helpers.passportCallbackWrapper).toHaveBeenCalledWith("github");
    });
  });

  describe("getUserDetailsOnOauthSuccess", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
      jest.clearAllMocks();
      res = { json: jest.fn() as jest.Mock };
      next = jest.fn();
    });

    it("responds with user details on success", async () => {
      req = {
        user: { username: "alice", user_id: "42", role: "admin" },
      };

      await getUserDetailsOnOauthSuccess(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({
        isAuthenticated: true,
        user: { username: "alice", userId: "42", role: "admin" },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 if user is missing", async () => {
      req = {};
      res.status = jest.fn().mockReturnThis();
      res.json = jest.fn();

      await getUserDetailsOnOauthSuccess(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        isAuthenticated: false,
        message: "No user found",
      });
    });

    it("calls next(err) on exception", async () => {
      const err = new Error("boom");
      const reqWithThrow = {
        get user() {
          throw err;
        },
      };
      await getUserDetailsOnOauthSuccess(
        reqWithThrow as unknown as Request,
        res as Response,
        next,
      );
      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
