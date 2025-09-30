const jwt = require("jsonwebtoken");
const { checkAuthenticationStatus, checkAuthorizationStatus } = require("../../middleware/auth");
const models = require("../../models");

jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));

jest.mock("../../models", () => ({
  User: { findOne: jest.fn() },
}));

const mockUser = { user_id: 123, username: "John", role: "user" };
const mockAdmin = { user_id: 1, username: "Admin", role: "admin" };

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    jwt.verify.mockReturnValue({ user: { user_id: 123 } });
    req = { headers: {}, cookies: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    req.cookies.access_token = "validtoken";
    jest.clearAllMocks();
  });

  describe("checkAuthenticationStatus", () => {
    it("returns 401 if user not found", async () => {
      models.User.findOne.mockResolvedValue(null);

      await checkAuthenticationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        authenticated: false,
        error: "authentication failed!",
      });
    });

    it("calls next if authentication succeeds", async () => {
      models.User.findOne.mockResolvedValue(mockUser);

      await checkAuthenticationStatus(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it("returns 401 with error message if jwt.verify throws", async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error("invalid token");
      });

      await checkAuthenticationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        authenticated: false,
        error: "invalid token",
      });
    });
  });

  describe("checkAuthorizationStatus", () => {
    it("returns 403 if not admin", async () => {
      models.User.findOne.mockResolvedValue(mockUser);

      await checkAuthorizationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        authorized: false,
        error: "John is unauthorized to access this resource.",
      });
    });

    it("calls next if admin", async () => {
      jwt.verify.mockReturnValue({ user: { user_id: 1 } });
      models.User.findOne.mockResolvedValue(mockAdmin);

      await checkAuthorizationStatus(req, res, next);

      expect(req.user).toEqual(mockAdmin);
      expect(next).toHaveBeenCalled();
    });
  });
});
