"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenGenerators_1 = require("../../utils/tokenGenerators");
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
            jsonwebtoken_1.default.sign.mockReturnValue("mockAccessToken");
            const user = { user_id: '123', name: "John" };
            const token = (0, tokenGenerators_1.generateAccessToken)(user);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ user: { user_id: '123' } }, "access-secret", {
                expiresIn: "1d",
            });
            expect(token).toBe("mockAccessToken");
        });
    });
    describe("generateRefreshToken", () => {
        test("should call jwt.sign with correct args", () => {
            jsonwebtoken_1.default.sign.mockReturnValue("mockRefreshToken");
            const user = { user_id: '456', firstname: "Jane" };
            const token = (0, tokenGenerators_1.generateRefreshToken)(user);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ user: { user_id: '456' } }, "refresh-secret", {
                expiresIn: "7d",
            });
            expect(token).toBe("mockRefreshToken");
        });
    });
    describe("integration between helpers", () => {
        test("generateAccessToken and generateRefreshToken should use generateToken internally", () => {
            const user = { user_id: '789' };
            (0, tokenGenerators_1.generateAccessToken)(user);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ user: { user_id: '789' } }, "access-secret", {
                expiresIn: "1d",
            });
            (0, tokenGenerators_1.generateRefreshToken)(user);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ user: { user_id: '789' } }, "refresh-secret", {
                expiresIn: "7d",
            });
        });
    });
});
