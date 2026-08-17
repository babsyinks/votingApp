"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateCustomError_1 = __importDefault(require("../utils/generateCustomError"));
const setCookies_1 = require("../utils/setCookies");
const tokenGenerators_1 = require("../utils/tokenGenerators");
/**
 * Handles refresh token flow by verifying refresh_token cookie and
 * issuing a new access token if valid.
 */
const refreshToken = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            (0, generateCustomError_1.default)("Token Refresh Unauthorized!", 403);
        }
        // Verify the refresh token using the secret
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded || typeof decoded === "string") {
            (0, generateCustomError_1.default)("Token Refresh Unauthorized!", 403);
        }
        // Generate a new access token for this user
        const accessToken = (0, tokenGenerators_1.generateAccessToken)(decoded);
        // Set cookie and send response
        (0, setCookies_1.setAccessTokenOnCookie)({ res: res.status(200), accessToken }).json({
            success: true,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.refreshToken = refreshToken;
