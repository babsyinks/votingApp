"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateAccessToken(user) {
    return generateToken({
        user,
        secret: "ACCESS_TOKEN_SECRET",
        expiresIn: "1d",
    });
}
function generateRefreshToken(user) {
    return generateToken({
        user,
        secret: "REFRESH_TOKEN_SECRET",
        expiresIn: "7d",
    });
}
function generateToken({ user, secret, expiresIn, }) {
    const secretKey = process.env[secret];
    const options = {
        expiresIn: expiresIn,
    };
    return jsonwebtoken_1.default.sign({ user: { user_id: user.user_id } }, secretKey, options);
}
