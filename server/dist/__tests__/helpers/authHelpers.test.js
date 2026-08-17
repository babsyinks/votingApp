"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const setCookies_1 = require("../../utils/setCookies");
const tokenGenerators_1 = require("../../utils/tokenGenerators");
jest.mock("bcryptjs");
jest.mock("../../utils/setCookies", () => ({
    setAccessTokenOnCookie: jest.fn(),
    setRefreshTokenOnCookie: jest.fn(),
}));
jest.mock("../../utils/tokenGenerators", () => ({
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
}));
const { hashPassWord, generateTokensAndSendResponse, generateTokensAndRedirect, } = require("../../helpers/authHelpers");
describe("authHelpers", () => {
    let mockedGenerateAccessToken = jest.mocked(tokenGenerators_1.generateAccessToken);
    let mockedGenerateRefreshToken = jest.mocked(tokenGenerators_1.generateRefreshToken);
    let mockedSetAccessTokenOnCookie = jest.mocked(setCookies_1.setAccessTokenOnCookie);
    let mockedSetRefreshTokenOnCookie = jest.mocked(setCookies_1.setRefreshTokenOnCookie);
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("hashPassWord", () => {
        test("should generate salt and hash the password", async () => {
            bcryptjs_1.default.genSalt.mockResolvedValue("salt123");
            bcryptjs_1.default.hash.mockResolvedValue("hashedPassword");
            const result = await hashPassWord("myPassword");
            expect(bcryptjs_1.default.genSalt).toHaveBeenCalledWith(10);
            expect(bcryptjs_1.default.hash).toHaveBeenCalledWith("myPassword", "salt123");
            expect(result).toBe("hashedPassword");
        });
    });
    describe("generateTokensAndSendResponse", () => {
        let user, res;
        beforeEach(() => {
            mockedGenerateAccessToken.mockReturnValue("access123");
            mockedGenerateRefreshToken.mockReturnValue("refresh456");
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            mockedSetAccessTokenOnCookie.mockImplementation(({ res, accessToken }) => {
                expect(accessToken).toBe("access123");
                return res;
            });
            mockedSetRefreshTokenOnCookie.mockImplementation(({ res, refreshToken }) => {
                expect(refreshToken).toBe("refresh456");
                return res;
            });
            user = {
                username: "John",
                firstname: "JohnBull",
                lastname: "Bill",
                user_id: "1",
                email: "email@mail.com",
                isAdmin: true,
                password: "hidden",
            };
        });
        test("should generate tokens, set cookies, and send response for admin", () => {
            generateTokensAndSendResponse({ res, user });
            expect(mockedGenerateAccessToken).toHaveBeenCalledWith(user);
            expect(mockedGenerateRefreshToken).toHaveBeenCalledWith(user);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                isAuthenticated: true,
                user: {
                    username: "John",
                    userId: "1",
                    role: "admin",
                },
            });
        });
        test("should generate tokens, set cookies, and send response for user", () => {
            user.isAdmin = false;
            generateTokensAndSendResponse({ res, user });
            expect(mockedGenerateAccessToken).toHaveBeenCalledWith(user);
            expect(mockedGenerateRefreshToken).toHaveBeenCalledWith(user);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                isAuthenticated: true,
                user: {
                    username: "John",
                    userId: "1",
                    role: "user",
                },
            });
        });
    });
    describe("generateTokensAndRedirect", () => {
        test("should generate tokens, set cookies, and redirect", () => {
            mockedGenerateAccessToken.mockReturnValue("access789");
            mockedGenerateRefreshToken.mockReturnValue("refresh987");
            const redirectUri = "/";
            const res = {
                cookie: jest.fn().mockReturnThis(),
                redirect: jest.fn(),
            };
            mockedSetAccessTokenOnCookie.mockImplementation(({ res, accessToken }) => {
                expect(accessToken).toBe("access789");
                return res;
            });
            mockedSetRefreshTokenOnCookie.mockImplementation(({ res, refreshToken }) => {
                expect(refreshToken).toBe("refresh987");
                return res;
            });
            const user = {
                username: "Jane",
                firstname: "Janet",
                lastname: "Marr",
                user_id: "2",
                email: "janet@mail.com",
                isAdmin: false,
                password: "hidden",
            };
            generateTokensAndRedirect({ res, user, redirectUri });
            expect(mockedGenerateAccessToken).toHaveBeenCalledWith(user);
            expect(mockedGenerateRefreshToken).toHaveBeenCalledWith(user);
            expect(res.redirect).toHaveBeenCalledWith(redirectUri);
        });
    });
});
