"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
jest.mock("bcryptjs");
jest.mock("../../utils/generateCustomError", () => {
    const { CustomError } = jest.requireActual("../../utils/generateCustomError");
    return jest.fn((message, statusCode) => {
        throw new CustomError(message, statusCode);
    });
});
const generateCustomError_1 = __importDefault(require("../../utils/generateCustomError"));
const authValidators_1 = require("../../validators/authValidators");
describe("authValidators", () => {
    const mockedUser = {
        user_id: "1",
        username: "user1",
        firstname: "john",
        lastname: "doe",
        email: "user@mail.com",
        password: "pw",
        isAdmin: false,
        role: "user",
    };
    const mockedBcryptCompare = bcryptjs_1.default.compare;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("failIfEmpty", () => {
        test("should throw if any field is empty", () => {
            expect(() => (0, authValidators_1.failIfEmpty)({ email: "", password: "123" })).toThrow("email field must be filled!");
            expect(generateCustomError_1.default).toHaveBeenCalledWith("email field must be filled!", 400);
        });
        test("should not throw if all fields are filled", () => {
            expect(() => (0, authValidators_1.failIfEmpty)({ email: "a", password: "b" })).not.toThrow();
        });
    });
    describe("failIfUserExists", () => {
        test("should throw if user exists", () => {
            expect(() => (0, authValidators_1.failIfUserExists)(mockedUser)).toThrow("This User Exists Already!");
            expect(generateCustomError_1.default).toHaveBeenCalledWith("This User Exists Already!", 403);
        });
        test("should not throw if user does not exist", () => {
            expect(() => (0, authValidators_1.failIfUserExists)(null)).not.toThrow();
        });
    });
    describe("failIfUserDoesNotExist", () => {
        test("should throw if user does not exist", () => {
            expect(() => (0, authValidators_1.failIfUserDoesNotExist)(null)).toThrow("User not found");
            expect(generateCustomError_1.default).toHaveBeenCalledWith("User not found", 400);
        });
        test("should not throw if user exists", () => {
            expect(() => (0, authValidators_1.failIfUserDoesNotExist)(mockedUser)).not.toThrow();
        });
    });
    describe("failIfVerificationCodeIsNotValid", () => {
        test("should throw if row is missing", async () => {
            await expect((0, authValidators_1.failIfVerificationCodeIsNotValid)("123", null)).rejects.toThrow("Invalid or expired code");
            expect(generateCustomError_1.default).toHaveBeenCalledWith("Invalid or expired code", 403);
        });
        test("should throw if bcrypt.compare returns false", async () => {
            mockedBcryptCompare.mockResolvedValue(false);
            await expect((0, authValidators_1.failIfVerificationCodeIsNotValid)("123", {
                code_id: "123",
                codeHash: "hash",
                email: "mail@mail.com",
                type: "signup",
                expiresAt: new Date("2025-10-02"),
            })).rejects.toThrow("Invalid or expired code");
        });
        test("should not throw if bcrypt.compare returns true", async () => {
            mockedBcryptCompare.mockResolvedValue(true);
            await expect((0, authValidators_1.failIfVerificationCodeIsNotValid)("123", {
                code_id: "123",
                codeHash: "hash",
                email: "mail@mail.com",
                type: "signup",
                expiresAt: new Date("2025-10-02"),
            })).resolves.not.toThrow();
        });
    });
    describe("validateCredentials", () => {
        test("should throw if user is null", async () => {
            await expect((0, authValidators_1.validateCredentials)(null, "pass")).rejects.toThrow("Wrong Username, Email or Password");
            expect(generateCustomError_1.default).toHaveBeenCalledWith("Wrong Username, Email or Password", 401);
        });
        test("should throw if password does not match", async () => {
            mockedBcryptCompare.mockResolvedValue(false);
            const user = { ...mockedUser, password: "hashed" };
            await expect((0, authValidators_1.validateCredentials)(user, "wrong")).rejects.toThrow("Wrong Username, Email or Password");
        });
        test("should not throw if password matches", async () => {
            mockedBcryptCompare.mockResolvedValue(true);
            const user = { ...mockedUser, password: "hashed" };
            await expect((0, authValidators_1.validateCredentials)(user, "correct")).resolves.not.toThrow();
        });
    });
    describe("failIfPasswordWeak", () => {
        test("should throw if password does not meet criteria", () => {
            expect(() => (0, authValidators_1.failIfPasswordWeak)("Short1!")).toThrow(/minimum length/i);
        });
        test("should not throw if password meets all criteria", () => {
            const strongPassword = "StrongPass1!";
            expect(() => (0, authValidators_1.failIfPasswordWeak)(strongPassword)).not.toThrow();
        });
    });
});
