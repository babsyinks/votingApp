const bcrypt = require("bcryptjs");

jest.mock("bcryptjs");

jest.mock("../../utils/generateCustomError", () =>
  jest.fn((message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    throw err;
  })
);

const generateCustomError = require("../../utils/generateCustomError");
const validators = require("../../validators/authValidators");

describe("authValidators", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("failIfEmpty", () => {
    test("should throw if any field is empty", () => {
      expect(() =>
        validators.failIfEmpty({ email: "", password: "123" })
      ).toThrow("email field must be filled!");
      expect(generateCustomError).toHaveBeenCalledWith(
        "email field must be filled!",
        400
      );
    });

    test("should not throw if all fields are filled", () => {
      expect(() =>
        validators.failIfEmpty({ email: "a", password: "b" })
      ).not.toThrow();
    });
  });

  describe("failIfUserExists", () => {
    test("should throw if user exists", () => {
      expect(() => validators.failIfUserExists({ id: 1 })).toThrow(
        "This User Exists Already!"
      );
      expect(generateCustomError).toHaveBeenCalledWith(
        "This User Exists Already!",
        403
      );
    });

    test("should not throw if user does not exist", () => {
      expect(() => validators.failIfUserExists(null)).not.toThrow();
    });
  });

  describe("failIfUserDoesNotExist", () => {
    test("should throw if user does not exist", () => {
      expect(() => validators.failIfUserDoesNotExist(null)).toThrow(
        "User not found"
      );
      expect(generateCustomError).toHaveBeenCalledWith("User not found", 400);
    });

    test("should not throw if user exists", () => {
      expect(() => validators.failIfUserDoesNotExist({ id: 1 })).not.toThrow();
    });
  });

  describe("failIfVerificationCodeIsNotValid", () => {
    test("should throw if row is missing", async () => {
      await expect(
        validators.failIfVerificationCodeIsNotValid("123", null)
      ).rejects.toThrow("Invalid or expired code");
      expect(generateCustomError).toHaveBeenCalledWith(
        "Invalid or expired code",
        403
      );
    });

    test("should throw if bcrypt.compare returns false", async () => {
      bcrypt.compare.mockResolvedValue(false);
      await expect(
        validators.failIfVerificationCodeIsNotValid("123", {
          codeHash: "hash",
        })
      ).rejects.toThrow("Invalid or expired code");
    });

    test("should not throw if bcrypt.compare returns true", async () => {
      bcrypt.compare.mockResolvedValue(true);
      await expect(
        validators.failIfVerificationCodeIsNotValid("123", {
          codeHash: "hash",
        })
      ).resolves.not.toThrow();
    });
  });

  describe("validateCredentials", () => {
    test("should throw if user is null", async () => {
      await expect(
        validators.validateCredentials(null, "pass")
      ).rejects.toThrow("Wrong Username, Email or Password");
      expect(generateCustomError).toHaveBeenCalledWith(
        "Wrong Username, Email or Password",
        401
      );
    });

    test("should throw if password does not match", async () => {
      bcrypt.compare.mockResolvedValue(false);
      const user = { password: "hashed" };
      await expect(
        validators.validateCredentials(user, "wrong")
      ).rejects.toThrow("Wrong Username, Email or Password");
    });

    test("should not throw if password matches", async () => {
      bcrypt.compare.mockResolvedValue(true);
      const user = { password: "hashed" };
      await expect(
        validators.validateCredentials(user, "correct")
      ).resolves.not.toThrow();
    });
  });

  describe("failIfPasswordWeak", () => {
    test("should throw if password does not meet criteria", () => {
      expect(() => validators.failIfPasswordWeak("Short1!")).toThrow(
        /minimum length/i
      );
    });

    test("should not throw if password meets all criteria", () => {
      const strongPassword = "StrongPass1!";
      expect(() =>
        validators.failIfPasswordWeak(strongPassword)
      ).not.toThrow();
    });
  });
});
