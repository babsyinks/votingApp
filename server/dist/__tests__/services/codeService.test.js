"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
jest.mock("../../utils/randomCodeGenerator", () => ({
    generateRandomDigitsCode: jest.fn(),
    getHashedDigitCode: jest.fn(),
    generateRandomHexCode: jest.fn(),
    getHashedHexCode: jest.fn(),
}));
const randomCodeGenerator_1 = require("../../utils/randomCodeGenerator");
const codeService_1 = __importDefault(require("../../services/codeService"));
describe("codeService", () => {
    let Code;
    let codeService;
    const mockedGenerateRandomDigitsCode = jest.mocked(randomCodeGenerator_1.generateRandomDigitsCode);
    const mockedGetHashedDigitCode = jest.mocked(randomCodeGenerator_1.getHashedDigitCode);
    const mockedGenerateRandomHexCode = jest.mocked(randomCodeGenerator_1.generateRandomHexCode);
    const mockedGetHashedHexCode = jest.mocked(randomCodeGenerator_1.getHashedHexCode);
    let mockedCodeFindOne;
    beforeEach(() => {
        Code = {
            create: jest.fn(),
            findOne: jest.fn(),
        };
        codeService = (0, codeService_1.default)(Code);
        mockedCodeFindOne = jest.mocked(Code.findOne);
        jest.clearAllMocks();
    });
    describe("createSignupCode", () => {
        it("should create a signup code and return the raw code", async () => {
            mockedGenerateRandomDigitsCode.mockReturnValue("123456");
            mockedGetHashedDigitCode.mockResolvedValue("hashed123456");
            const email = "test@example.com";
            await expect(codeService.createSignupCode(email)).resolves.toBe("123456");
            expect(mockedGenerateRandomDigitsCode).toHaveBeenCalledTimes(1);
            expect(mockedGetHashedDigitCode).toHaveBeenCalledWith("123456");
            expect(Code.create).toHaveBeenCalledWith(expect.objectContaining({
                email,
                codeHash: "hashed123456",
                type: "signup",
            }));
        });
    });
    describe("getLatestValidSignupCode", () => {
        it("should return latest valid signup code", async () => {
            const mockCode = { id: 1 };
            mockedCodeFindOne.mockResolvedValue(mockCode);
            const result = await codeService.getLatestValidSignupCode("test@example.com");
            expect(mockedCodeFindOne).toHaveBeenCalledWith({
                where: {
                    email: "test@example.com",
                    type: "signup",
                    expiresAt: { [sequelize_1.Op.gte]: expect.any(Date) },
                },
                order: [["createdAt", "DESC"]],
            });
            expect(result).toEqual({ id: 1 });
        });
        it("should return null if no code is found", async () => {
            mockedCodeFindOne.mockResolvedValue(null);
            const result = await codeService.getLatestValidSignupCode("test@example.com");
            expect(result).toBeNull();
        });
    });
    describe("createResetCode", () => {
        it("should create a reset code and return the raw code", async () => {
            mockedGenerateRandomHexCode.mockReturnValue("abc123");
            mockedGetHashedHexCode.mockReturnValue("hashedabc123");
            const email = "reset@example.com";
            const result = await codeService.createResetCode(email);
            expect(result).toBe("abc123");
            expect(mockedGenerateRandomHexCode).toHaveBeenCalledTimes(1);
            expect(mockedGetHashedHexCode).toHaveBeenCalledWith("abc123");
            expect(Code.create).toHaveBeenCalledWith(expect.objectContaining({
                email,
                codeHash: "hashedabc123",
                type: "password_reset",
            }));
        });
    });
    describe("findValidResetCodeRecord", () => {
        it("should find and return valid reset code record", async () => {
            const mockRecord = { id: 99 };
            mockedCodeFindOne.mockResolvedValue(mockRecord);
            mockedGetHashedHexCode.mockReturnValue("hashed123");
            const result = await codeService.findValidResetCodeRecord("123");
            expect(mockedGetHashedHexCode).toHaveBeenCalledWith("123");
            expect(mockedCodeFindOne).toHaveBeenCalledWith({
                where: {
                    codeHash: "hashed123",
                    expiresAt: { [sequelize_1.Op.gt]: expect.any(Date) },
                },
            });
            expect(result).toBe(mockRecord);
        });
        it("should return null if no record found", async () => {
            mockedCodeFindOne.mockResolvedValue(null);
            mockedGetHashedHexCode.mockReturnValue("hashed456");
            const result = await codeService.findValidResetCodeRecord("456");
            expect(result).toBeNull();
        });
    });
});
