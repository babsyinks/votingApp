"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = require("sequelize");
const errorHandler_1 = __importDefault(require("../../middleware/errorHandler"));
const logger_1 = __importDefault(require("../../utils/logger"));
const generateCustomError_1 = require("../../utils/generateCustomError");
jest.mock("../../utils/logger", () => ({
    error: jest.fn(),
}));
describe("errorHandler middleware", () => {
    let req, res, next;
    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        process.env.NODE_ENV = "development";
        jest.clearAllMocks();
    });
    it("handles generic error", () => {
        const err = new Error("Something went wrong");
        (0, errorHandler_1.default)(err, req, res, next);
        expect(logger_1.default.error).toHaveBeenCalledWith(err);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: { message: "Something went wrong" },
            stack: err.stack,
        }));
    });
    it("handles JWT TokenExpiredError", () => {
        const err = new jsonwebtoken_1.default.TokenExpiredError("jwt expired", new Date());
        (0, errorHandler_1.default)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: { message: "Token has expired." },
        }));
    });
    it("handles JWT JsonWebTokenError", () => {
        const err = new jsonwebtoken_1.default.JsonWebTokenError("invalid signature");
        (0, errorHandler_1.default)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: { message: "Invalid token." },
        }));
    });
    it("handles Sequelize ValidationError", () => {
        const errorItems = [
            new sequelize_1.ValidationErrorItem("Name is required", "validation error", "path", "error", undefined, "validation_key", "fn", []),
            new sequelize_1.ValidationErrorItem("Email is invalid", "validation error", "path", "error", undefined, "validation_key", "fn", []),
        ];
        const err = new sequelize_1.ValidationError("Validation failed", errorItems);
        (0, errorHandler_1.default)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(422);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: { message: "Name is required; Email is invalid" },
        }));
    });
    it("uses default message when err.message is falsy", () => {
        const err = new Error();
        err.message = "";
        (0, errorHandler_1.default)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: { message: "An unexpected error occurred." },
            stack: err.stack,
        }));
    });
    it("respects custom statusCode from error object", () => {
        const err = new generateCustomError_1.CustomError("Custom error", 418);
        (0, errorHandler_1.default)(err, req, res, next);
        expect(res.status).toHaveBeenCalledWith(418);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: { message: "Custom error" },
        }));
    });
    it("omits stack trace in production mode", () => {
        process.env.NODE_ENV = "production";
        const err = new Error("Prod error");
        (0, errorHandler_1.default)(err, req, res, next);
        expect(res.json).toHaveBeenCalledWith({
            error: { message: "Prod error" },
        });
    });
});
