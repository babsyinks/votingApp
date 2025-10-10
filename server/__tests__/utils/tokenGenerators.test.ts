import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/tokenGenerators";
import type { User } from "../../models";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("tokenGenerators", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ACCESS_TOKEN_SECRET = "access-secret";
    process.env.REFRESH_TOKEN_SECRET = "refresh-secret";
  });

  describe("generateAccessToken", () => {
    test("should call jwt.sign with correct args", () => {
      (jwt.sign as jest.Mock).mockReturnValue("mockAccessToken");

      const user = { user_id: '123', name: "John" } as unknown as User;
      const token = generateAccessToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        { user: { user_id: '123' } },
        "access-secret",
        {
          expiresIn: "1d",
        },
      );
      expect(token).toBe("mockAccessToken");
    });
  });

  describe("generateRefreshToken", () => {
    test("should call jwt.sign with correct args", () => {
      (jwt.sign as jest.Mock).mockReturnValue("mockRefreshToken");

      const user = { user_id: '456', firstname: "Jane" } as unknown as User;
      const token = generateRefreshToken(user);

      expect(jwt.sign).toHaveBeenCalledWith(
        { user: { user_id: '456' } },
        "refresh-secret",
        {
          expiresIn: "7d",
        },
      );
      expect(token).toBe("mockRefreshToken");
    });
  });

  describe("integration between helpers", () => {
    test("generateAccessToken and generateRefreshToken should use generateToken internally", () => {
      const user = { user_id: '789' } as unknown as User;

      generateAccessToken(user);
      expect(jwt.sign).toHaveBeenCalledWith(
        { user: { user_id: '789' } },
        "access-secret",
        {
          expiresIn: "1d",
        },
      );

      generateRefreshToken(user);
      expect(jwt.sign).toHaveBeenCalledWith(
        { user: { user_id: '789' } },
        "refresh-secret",
        {
          expiresIn: "7d",
        },
      );
    });
  });
});
