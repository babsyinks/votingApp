const bcrypt = require("bcryptjs");
const {
  setAccessTokenOnCookie,
  setRefreshTokenOnCookie,
} = require("../../utils/setCookies");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/tokenGenerators");

jest.mock("bcryptjs");
jest.mock("../../utils/setCookies", () => ({
  setAccessTokenOnCookie: jest.fn(),
  setRefreshTokenOnCookie: jest.fn(),
}));
jest.mock("../../utils/tokenGenerators", () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

const {
  hashPassWord,
  generateTokensAndSendResponse,
  generateTokensAndRedirect,
} = require("../../helpers/authControllerHelpers");

describe("authControllerHelpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hashPassWord", () => {
    test("should generate salt and hash the password", async () => {
      bcrypt.genSalt.mockResolvedValue("salt123");
      bcrypt.hash.mockResolvedValue("hashedPassword");

      const result = await hashPassWord("myPassword");

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("myPassword", "salt123");
      expect(result).toBe("hashedPassword");
    });
  });

  describe("generateTokensAndSendResponse", () => {
    test("should generate tokens, set cookies, and send response", () => {
      generateAccessToken.mockReturnValue("access123");
      generateRefreshToken.mockReturnValue("refresh456");

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      setAccessTokenOnCookie.mockImplementation(({ res, accessToken }) => {
        expect(accessToken).toBe("access123");
        return res;
      });

      setRefreshTokenOnCookie.mockImplementation(({ res, refreshToken }) => {
        expect(refreshToken).toBe("refresh456");
        return res;
      });

      const user = { username: "John", user_id: 1, role: "admin", password: "hidden" };

      generateTokensAndSendResponse({ res, user });

      expect(generateAccessToken).toHaveBeenCalledWith(user);
      expect(generateRefreshToken).toHaveBeenCalledWith(user);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        isAuthenticated: true,
        user: { username: "John", userId: 1, role: "admin" },
      });
    });
  });

  describe("generateTokensAndRedirect", () => {
    test("should generate tokens, set cookies, and redirect", () => {
      generateAccessToken.mockReturnValue("access789");
      generateRefreshToken.mockReturnValue("refresh987");

      const redirectUri = "/";

      const res = {
        cookie: jest.fn().mockReturnThis(),
        redirect: jest.fn(),
      };

      setAccessTokenOnCookie.mockImplementation(({ res, accessToken }) => {
        expect(accessToken).toBe("access789");
        return res;
      });

      setRefreshTokenOnCookie.mockImplementation(({ res, refreshToken }) => {
        expect(refreshToken).toBe("refresh987");
        return res;
      });

      const user = { username: "Jane", user_id: 2, role: "user" };

      generateTokensAndRedirect({ res, user, redirectUri });

      expect(generateAccessToken).toHaveBeenCalledWith(user);
      expect(generateRefreshToken).toHaveBeenCalledWith(user);
      expect(res.redirect).toHaveBeenCalledWith(redirectUri);
    });
  });
});
