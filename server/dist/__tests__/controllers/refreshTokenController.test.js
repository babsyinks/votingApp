"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateCustomError_1 = __importDefault(require("../../utils/generateCustomError"));
const setCookies_1 = require("../../utils/setCookies");
const tokenGenerators_1 = require("../../utils/tokenGenerators");
const refreshTokenController_1 = require("../../controllers/refreshTokenController");
jest.mock("jsonwebtoken");
jest.mock("../../utils/generateCustomError");
jest.mock("../../utils/setCookies");
jest.mock("../../utils/tokenGenerators");
describe("refreshTokenController", () => {
    let req;
    let res;
    let next;
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
        req.cookies.refresh_token = "validRefreshToken";
        jsonwebtoken_1.default.verify.mockReturnValue(mockUser);
        tokenGenerators_1.generateAccessToken.mockReturnValue(mockAccessToken);
        setCookies_1.setAccessTokenOnCookie.mockReturnValue(res);
        (0, refreshTokenController_1.refreshToken)(req, res, next);
        expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith("validRefreshToken", process.env.REFRESH_TOKEN_SECRET);
        expect(tokenGenerators_1.generateAccessToken).toHaveBeenCalledWith(mockUser);
        expect(setCookies_1.setAccessTokenOnCookie).toHaveBeenCalledWith({
            res: res,
            accessToken: mockAccessToken,
        });
        expect(res.json).toHaveBeenCalledWith({ success: true });
        expect(next).not.toHaveBeenCalled();
    });
    it("should call generateCustomError if refresh token is missing", () => {
        req.cookies = {}; // No refresh_token
        (0, refreshTokenController_1.refreshToken)(req, res, next);
        expect(generateCustomError_1.default).toHaveBeenCalledWith("Token Refresh Unauthorized!", 403);
        expect(next).not.toHaveBeenCalled();
    });
    it("should call generateCustomError if refresh token is invalid", () => {
        req.cookies.refresh_token = "invalidToken";
        jsonwebtoken_1.default.verify.mockReturnValue(null);
        (0, refreshTokenController_1.refreshToken)(req, res, next);
        expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith("invalidToken", process.env.REFRESH_TOKEN_SECRET);
        expect(generateCustomError_1.default).toHaveBeenCalledWith("Token Refresh Unauthorized!", 403);
        expect(next).not.toHaveBeenCalled();
    });
    it("should call next(err) if jwt.verify throws", () => {
        const mockError = new Error("JWT verification failed");
        req.cookies.refresh_token = "token";
        jsonwebtoken_1.default.verify.mockImplementation(() => {
            throw mockError;
        });
        (0, refreshTokenController_1.refreshToken)(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);
    });
    it("should call next(err) if setAccessTokenOnCookie throws", () => {
        const mockError = new Error("Cookie set failed");
        req.cookies.refresh_token = "validToken";
        jsonwebtoken_1.default.verify.mockReturnValue({ id: '1' });
        tokenGenerators_1.generateAccessToken.mockReturnValue("accessToken");
        setCookies_1.setAccessTokenOnCookie.mockImplementation(() => {
            throw mockError;
        });
        (0, refreshTokenController_1.refreshToken)(req, res, next);
        expect(next).toHaveBeenCalledWith(mockError);
    });
});
