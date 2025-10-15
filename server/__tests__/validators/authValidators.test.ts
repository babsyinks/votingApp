import bcrypt from "bcryptjs";
import { CustomError } from "../../utils/generateCustomError";
import type { ValidUser } from "../../helpers/types/validAuthUser";

jest.mock("bcryptjs");

jest.mock("../../utils/generateCustomError", () => {
  const { CustomError } = jest.requireActual("../../utils/generateCustomError");
  return jest.fn((message: string, statusCode: number) => {
    throw new CustomError(message, statusCode);
  });
});

import generateCustomError from "../../utils/generateCustomError";

import {
  failIfEmpty,
  failIfUserExists,
  failIfUserDoesNotExist,
  validateCredentials,
  failIfVerificationCodeIsNotValid,
  failIfPasswordWeak,
} from "../../validators/authValidators";

describe("authValidators", () => {
  const mockedUser: ValidUser = {
    user_id: "1",
    username: "user1",
    firstname: "john",
    lastname: "doe",
    email: "user@mail.com",
    password: "pw",
    isAdmin: false,
    role: "user",
  };

  const mockedBcryptCompare = bcrypt.compare as jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("failIfEmpty", () => {
    test("should throw if any field is empty", () => {
      expect(() => failIfEmpty({ email: "", password: "123" })).toThrow(
        "email field must be filled!",
      );
      expect(generateCustomError).toHaveBeenCalledWith(
        "email field must be filled!",
        400,
      );
    });

    test("should not throw if all fields are filled", () => {
      expect(() => failIfEmpty({ email: "a", password: "b" })).not.toThrow();
    });
  });

  describe("failIfUserExists", () => {
    test("should throw if user exists", () => {
      expect(() => failIfUserExists(mockedUser)).toThrow(
        "This User Exists Already!",
      );
      expect(generateCustomError).toHaveBeenCalledWith(
        "This User Exists Already!",
        403,
      );
    });

    test("should not throw if user does not exist", () => {
      expect(() => failIfUserExists(null)).not.toThrow();
    });
  });

  describe("failIfUserDoesNotExist", () => {
    test("should throw if user does not exist", () => {
      expect(() => failIfUserDoesNotExist(null)).toThrow("User not found");
      expect(generateCustomError).toHaveBeenCalledWith("User not found", 400);
    });

    test("should not throw if user exists", () => {
      expect(() => failIfUserDoesNotExist(mockedUser)).not.toThrow();
    });
  });

  describe("failIfVerificationCodeIsNotValid", () => {
    test("should throw if row is missing", async () => {
      await expect(
        failIfVerificationCodeIsNotValid("123", null),
      ).rejects.toThrow("Invalid or expired code");
      expect(generateCustomError).toHaveBeenCalledWith(
        "Invalid or expired code",
        403,
      );
    });

    test("should throw if bcrypt.compare returns false", async () => {
      mockedBcryptCompare.mockResolvedValue(false);
      await expect(
        failIfVerificationCodeIsNotValid("123", {
          code_id: "123",
          codeHash: "hash",
          email: "mail@mail.com",
          type: "signup",
          expiresAt: new Date("2025-10-02"),
        }),
      ).rejects.toThrow("Invalid or expired code");
    });

    test("should not throw if bcrypt.compare returns true", async () => {
      mockedBcryptCompare.mockResolvedValue(true);
      await expect(
        failIfVerificationCodeIsNotValid("123", {
          code_id: "123",
          codeHash: "hash",
          email: "mail@mail.com",
          type: "signup",
          expiresAt: new Date("2025-10-02"),
        }),
      ).resolves.not.toThrow();
    });
  });

  describe("validateCredentials", () => {
    test("should throw if user is null", async () => {
      await expect(validateCredentials(null, "pass")).rejects.toThrow(
        "Wrong Username, Email or Password",
      );
      expect(generateCustomError).toHaveBeenCalledWith(
        "Wrong Username, Email or Password",
        401,
      );
    });

    test("should throw if password does not match", async () => {
      mockedBcryptCompare.mockResolvedValue(false);
      const user = { ...mockedUser, password: "hashed" };
      await expect(validateCredentials(user, "wrong")).rejects.toThrow(
        "Wrong Username, Email or Password",
      );
    });

    test("should not throw if password matches", async () => {
      mockedBcryptCompare.mockResolvedValue(true);
      const user = { ...mockedUser, password: "hashed" };
      await expect(validateCredentials(user, "correct")).resolves.not.toThrow();
    });
  });

  describe("failIfPasswordWeak", () => {
    test("should throw if password does not meet criteria", () => {
      expect(() => failIfPasswordWeak("Short1!")).toThrow(/minimum length/i);
    });

    test("should not throw if password meets all criteria", () => {
      const strongPassword = "StrongPass1!";
      expect(() => failIfPasswordWeak(strongPassword)).not.toThrow();
    });
  });
});
