"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const jsonwebtoken_1 = require("jsonwebtoken");
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../utils/logger"));
function errorHandler(err, req, res, next) {
    const errorDetails = {
        statusCode: err.statusCode || 400,
        message: err.message || "An unexpected error occurred.",
    };
    handleJwtErrors(err, errorDetails);
    handleValidationErrors(err, errorDetails);
    const { statusCode, message } = errorDetails;
    logger_1.default.error(err);
    res.status(statusCode).json({
        error: { message },
        ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
    });
}
function handleJwtErrors(err, errorDetails) {
    if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        errorDetails.statusCode = 401;
        errorDetails.message = "Token has expired.";
    }
    else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        errorDetails.statusCode = 401;
        errorDetails.message = "Invalid token.";
    }
}
function handleValidationErrors(err, errorDetails) {
    if (err instanceof sequelize_1.ValidationError) {
        errorDetails.statusCode = 422;
        errorDetails.message = err.errors.map((e) => e.message).join("; ");
    }
}
exports.default = errorHandler;
