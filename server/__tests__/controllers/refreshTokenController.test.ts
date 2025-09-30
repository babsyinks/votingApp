const jwt = require("jsonwebtoken");
const generateCustomError = require("../../utils/generateCustomError");
const { setAccessTokenOnCookie } = require("../../utils/setCookies");
const { generateAccessToken } = require("../../utils/tokenGenerators");

jest.mock("jsonwebtoken");
jest.mock("../../utils/generateCustomError");
jest.mock("../../utils/setCookies");
jest.mock("../../utils/tokenGenerators");

const { refreshToken } = require("../../controllers/refreshTokenController");

describe("refreshTokenController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 200 and set access token on cookie when refresh token is valid", () => {
    const mockUser = { id: 1, username: "testuser" };
    const mockAccessToken = "newAccessToken";

    req.cookies.refresh_token = "validRefreshToken";
    jwt.verify.mockReturnValue(mockUser);
    generateAccessToken.mockReturnValue(mockAccessToken);
    setAccessTokenOnCookie.mockReturnValue(res);

    refreshToken(req, res, next);

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

    refreshToken(req, res, next);

    expect(generateCustomError).toHaveBeenCalledWith(
      "Token Refresh Unauthorized!",
      403
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("should call generateCustomError if refresh token is invalid", () => {
    req.cookies.refresh_token = "invalidToken";
    jwt.verify.mockReturnValue(null);

    refreshToken(req, res, next);

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
    req.cookies.refresh_token = "token";
    jwt.verify.mockImplementation(() => {
      throw mockError;
    });

    refreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  it("should call next(err) if setAccessTokenOnCookie throws", () => {
    const mockError = new Error("Cookie set failed");
    req.cookies.refresh_token = "validToken";
    jwt.verify.mockReturnValue({ id: 1 });
    generateAccessToken.mockReturnValue("accessToken");
    setAccessTokenOnCookie.mockImplementation(() => {
      throw mockError;
    });

    refreshToken(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
