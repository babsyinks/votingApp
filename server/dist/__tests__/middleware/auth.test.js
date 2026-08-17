"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../../middleware/auth");
const models_1 = __importDefault(require("../../models"));
jest.mock("jsonwebtoken", () => ({ verify: jest.fn() }));
jest.mock("../../models", () => ({
    User: { findOne: jest.fn() },
}));
const mockUser = { user_id: 123, username: "John", role: "user" };
const mockAdmin = { user_id: 1, username: "Admin", role: "admin" };
describe("Auth Middleware", () => {
    let req, res, next;
    const mockedJwtVerify = jsonwebtoken_1.default.verify;
    const mockedUserFindOne = models_1.default.User.findOne;
    beforeEach(() => {
        mockedJwtVerify.mockReturnValue({ user: { user_id: 123 } });
        req = { headers: {}, cookies: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        req.cookies.access_token = "validtoken";
        jest.clearAllMocks();
    });
    describe("checkAuthenticationStatus", () => {
        it("returns 401 if user not found", async () => {
            mockedUserFindOne.mockResolvedValue(null);
            await (0, auth_1.checkAuthenticationStatus)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                authenticated: false,
                error: "authentication failed!",
            });
        });
        it("calls next if authentication succeeds", async () => {
            mockedUserFindOne.mockResolvedValue({ toJSON: () => mockUser });
            await (0, auth_1.checkAuthenticationStatus)(req, res, next);
            expect(req.user).toEqual(mockUser);
            expect(next).toHaveBeenCalledTimes(1);
        });
        it("returns 401 with error message if jwt.verify throws", async () => {
            mockedJwtVerify.mockImplementation(() => {
                throw new Error("invalid token");
            });
            await (0, auth_1.checkAuthenticationStatus)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                authenticated: false,
                error: "invalid token",
            });
        });
        it("returns 401 and uses error.message when jwt.verify throws an Error object", async () => {
            mockedJwtVerify.mockImplementation(() => {
                throw new Error("boom");
            });
            await (0, auth_1.checkAuthenticationStatus)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                authenticated: false,
                error: "boom", // exercises the 'error instanceof Error' branch
            });
            expect(next).not.toHaveBeenCalled();
        });
        it("returns 401 and stringifies non-Error thrown value from jwt.verify", async () => {
            mockedJwtVerify.mockImplementation(() => {
                throw "string-error";
            });
            await (0, auth_1.checkAuthenticationStatus)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                authenticated: false,
                error: "string-error", // exercises the String(error) branch
            });
            expect(next).not.toHaveBeenCalled();
        });
        it("returns 401 if no token provided", async () => {
            req.cookies.access_token = undefined; // simulate missing cookie
            await (0, auth_1.checkAuthenticationStatus)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                authenticated: false,
                error: "authentication failed!",
            });
            expect(next).not.toHaveBeenCalled();
        });
        it("returns 401 if jwt payload does not contain user_id", async () => {
            mockedJwtVerify.mockReturnValue({ user: {} }); // no user_id field
            await (0, auth_1.checkAuthenticationStatus)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                authenticated: false,
                error: "authentication failed!",
            });
            expect(next).not.toHaveBeenCalled();
        });
    });
    describe("checkAuthorizationStatus", () => {
        it("returns 403 if not admin", async () => {
            mockedUserFindOne.mockResolvedValue({ toJSON: () => mockUser });
            await (0, auth_1.checkAuthorizationStatus)(req, res, next);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                authorized: false,
                error: "John is unauthorized to access this resource.",
            });
        });
        it("calls next if admin", async () => {
            mockedJwtVerify.mockReturnValue({ user: { user_id: 1 } });
            mockedUserFindOne.mockResolvedValue({ toJSON: () => mockAdmin });
            await (0, auth_1.checkAuthorizationStatus)(req, res, next);
            expect(req.user).toEqual(mockAdmin);
            expect(next).toHaveBeenCalledTimes(1);
        });
    });
});
