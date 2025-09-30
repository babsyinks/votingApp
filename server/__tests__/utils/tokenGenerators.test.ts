const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("tokenGenerators", () => {
  let tokenGenerators;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ACCESS_TOKEN_SECRET = "access-secret";
    process.env.REFRESH_TOKEN_SECRET = "refresh-secret";

    // Fresh import after resetting mocks
    tokenGenerators = require("../../utils/tokenGenerators");
  });

  describe("generateAccessToken", () => {
    test("should call jwt.sign with correct args", () => {
      jwt.sign.mockReturnValue("mockAccessToken");

      const user = { user_id: 123, name: "John" };
      const token = tokenGenerators.generateAccessToken(user);

      expect(jwt.sign).toHaveBeenCalledWith({ user: { user_id: 123 } }, "access-secret", {
        expiresIn: "1d",
      });
      expect(token).toBe("mockAccessToken");
    });
  });

  describe("generateRefreshToken", () => {
    test("should call jwt.sign with correct args", () => {
      jwt.sign.mockReturnValue("mockRefreshToken");

      const user = { user_id: 456, name: "Jane" };
      const token = tokenGenerators.generateRefreshToken(user);

      expect(jwt.sign).toHaveBeenCalledWith({ user: { user_id: 456 } }, "refresh-secret", {
        expiresIn: "7d",
      });
      expect(token).toBe("mockRefreshToken");
    });
  });

  describe("integration between helpers", () => {
    test("generateAccessToken and generateRefreshToken should use generateToken internally", () => {
      const user = { user_id: 789 };

      tokenGenerators.generateAccessToken(user);
      expect(jwt.sign).toHaveBeenCalledWith({ user: { user_id: 789 } }, "access-secret", {
        expiresIn: "1d",
      });

      tokenGenerators.generateRefreshToken(user);
      expect(jwt.sign).toHaveBeenCalledWith({ user: { user_id: 789 } }, "refresh-secret", {
        expiresIn: "7d",
      });
    });
  });
});
