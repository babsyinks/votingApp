import jwt from "jsonwebtoken";
import generateCustomError from "../../utils/generateCustomError";
import { setAccessTokenOnCookie } from "../../utils/setCookies";
import { generateAccessToken } from "../../utils/tokenGenerators";
import { refreshToken } from "../../controllers/refreshTokenController";
import { Request, Response, NextFunction } from "express";

jest.mock("jsonwebtoken");
jest.mock("../../utils/generateCustomError");
jest.mock("../../utils/setCookies");
jest.mock("../../utils/tokenGenerators");

describe("refreshTokenController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 200 and set access token on cookie when refresh token is valid", () => {
    const mockUser = { id: '1', username: "testuser" };
    const mockAccessToken = "newAccessToken";

    (req.cookies as any).refresh_token = "validRefreshToken";
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);
    (generateAccessToken as jest.Mock).mockReturnValue(mockAccessToken);
    (setAccessTokenOnCookie as jest.Mock).mockReturnValue(res);

    refreshToken(req as Request, res as Response, next as NextFunction);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validRefreshToken",
      process.env.REFRESH_TOKEN_SECRET
    );
    expect(generateAccessToken).toHaveBeenCalledWith(mockUser);
    expect(setAccessTokenOnCookie).toHaveBeenCalledWith({
      res: res,
      accessToken: mockAccessToken,
    });
    expect(res.json).toHaveBeenCalledWith({ success: true });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call generateCustomError if refresh token is missing", () => {
    req.cookies = {}; // No refresh_token

    refreshToken(req as Request, res as Response, next as NextFunction);

    expect(generateCustomError).toHaveBeenCalledWith(
      "Token Refresh Unauthorized!",
      403
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call generateCustomError if refresh token is invalid", () => {
    (req.cookies as any).refresh_token = "invalidToken";
    (jwt.verify as jest.Mock).mockReturnValue(null);

    refreshToken(req as Request, res as Response, next as NextFunction);

    expect(jwt.verify).toHaveBeenCalledWith(
      "invalidToken",
      process.env.REFRESH_TOKEN_SECRET
    );
    expect(generateCustomError).toHaveBeenCalledWith(
      "Token Refresh Unauthorized!",
      403
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next(err) if jwt.verify throws", () => {
    const mockError = new Error("JWT verification failed");
    (req.cookies as any).refresh_token = "token";
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    refreshToken(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  it("should call next(err) if setAccessTokenOnCookie throws", () => {
    const mockError = new Error("Cookie set failed");
    (req.cookies as any).refresh_token = "validToken";
    (jwt.verify as jest.Mock).mockReturnValue({ id: '1' });
    (generateAccessToken as jest.Mock).mockReturnValue("accessToken");
    (setAccessTokenOnCookie as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    refreshToken(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
