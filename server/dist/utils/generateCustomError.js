"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
exports.default = generateCustomError;
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "CustomError";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
function generateCustomError(message, statusCode) {
    throw new CustomError(message, statusCode);
}
