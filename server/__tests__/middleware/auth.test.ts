import jwt from "jsonwebtoken";
import {
  checkAuthenticationStatus,
  checkAuthorizationStatus,
} from "../../middleware/auth";
import models from "../../models";
import type { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));

jest.mock("../../models", () => ({
  User: { findOne: jest.fn() },
}));

const mockUser = { user_id: 123, username: "John", role: "user" };
const mockAdmin = { user_id: 1, username: "Admin", role: "admin" };

describe("Auth Middleware", () => {
  let req: Request, res: Response, next: NextFunction;
  const mockedJwtVerify = jwt.verify as jest.Mock;
  const mockedUserFindOne = models.User.findOne as jest.Mock;

  beforeEach(() => {
    mockedJwtVerify.mockReturnValue({ user: { user_id: 123 } });
    req = { headers: {}, cookies: {} } as unknown as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
    req.cookies.access_token = "validtoken";
    jest.clearAllMocks();
  });

  describe("checkAuthenticationStatus", () => {
    it("returns 401 if user not found", async () => {
      mockedUserFindOne.mockResolvedValue(null);

      await checkAuthenticationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        authenticated: false,
        error: "authentication failed!",
      });
    });

    it("calls next if authentication succeeds", async () => {
      mockedUserFindOne.mockResolvedValue({ toJSON: () => mockUser });

      await checkAuthenticationStatus(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalledTimes(1);
    });

    it("returns 401 with error message if jwt.verify throws", async () => {
      mockedJwtVerify.mockImplementation(() => {
        throw new Error("invalid token");
      });

      await checkAuthenticationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        authenticated: false,
        error: "invalid token",
      });
    });

    it("returns 401 and uses error.message when jwt.verify throws an Error object", async () => {
      mockedJwtVerify.mockImplementation(() => {
        throw new Error("boom");
      });

      await checkAuthenticationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        authenticated: false,
        error: "boom", // exercises the 'error instanceof Error' branch
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 and stringifies non-Error thrown value from jwt.verify", async () => {
      mockedJwtVerify.mockImplementation(() => {
        throw "string-error";
      });

      await checkAuthenticationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        authenticated: false,
        error: "string-error", // exercises the String(error) branch
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 if no token provided", async () => {
      req.cookies.access_token = undefined; // simulate missing cookie

      await checkAuthenticationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        authenticated: false,
        error: "authentication failed!",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 if jwt payload does not contain user_id", async () => {
      mockedJwtVerify.mockReturnValue({ user: {} }); // no user_id field

      await checkAuthenticationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        authenticated: false,
        error: "authentication failed!",
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("checkAuthorizationStatus", () => {
    it("returns 403 if not admin", async () => {
      mockedUserFindOne.mockResolvedValue({ toJSON: () => mockUser });

      await checkAuthorizationStatus(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        authorized: false,
        error: "John is unauthorized to access this resource.",
      });
    });

    it("calls next if admin", async () => {
      mockedJwtVerify.mockReturnValue({ user: { user_id: 1 } });
      mockedUserFindOne.mockResolvedValue({ toJSON: () => mockAdmin });

      await checkAuthorizationStatus(req, res, next);

      expect(req.user).toEqual(mockAdmin);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
