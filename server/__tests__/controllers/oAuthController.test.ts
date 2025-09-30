jest.mock("../../helpers/oAuthControllerHelpers", () => ({
  passportCallbackWrapper: jest.fn((provider) => `${provider}CallbackWrapper`),
  getOauthStartMiddleware: jest.fn((provider, _config) => `${provider}StartMiddleware`),
}));

const helpers = require("../../helpers/oAuthControllerHelpers");

const {
  googleOauthStart,
  googleOauthConclude,
  facebookOauthStart,
  facebookOauthConclude,
  githubOauthStart,
  githubOauthConclude,
  getUserDetailsOnOauthSuccess,
} = require("../../controllers/oAuthController");

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
    
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("responds with user details on success", async () => {
      const req = { user: { username: "alice", userId: 42, role: "admin" } };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await getUserDetailsOnOauthSuccess(req, res, next);

      expect(res.json).toHaveBeenCalledWith({
        isAuthenticated: true,
        user: { username: "alice", userId: 42, role: "admin" },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next(err) on exception", async () => {
      const err = new Error("boom");
      const req = {
        get user() {
          throw err;
        },
      };
      const res = { json: jest.fn() };
      const next = jest.fn();

      await getUserDetailsOnOauthSuccess(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
