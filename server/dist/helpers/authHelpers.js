"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassWord = hashPassWord;
exports.generateTokensAndSendResponse = generateTokensAndSendResponse;
exports.generateTokensAndRedirect = generateTokensAndRedirect;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const setCookies_1 = require("../utils/setCookies");
const tokenGenerators_1 = require("../utils/tokenGenerators");
async function hashPassWord(password) {
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(password, salt);
    return hashedPassword;
}
function generateTokensAndSendResponse({ res, user, }) {
    const { accessToken, refreshToken } = _generateTokens(user);
    _sendResponseForAuthenticatedUser({ res, accessToken, refreshToken, user });
}
function generateTokensAndRedirect({ res, user, redirectUri, }) {
    const { accessToken, refreshToken } = _generateTokens(user);
    (0, setCookies_1.setRefreshTokenOnCookie)({
        res: (0, setCookies_1.setAccessTokenOnCookie)({ res, accessToken }),
        refreshToken,
    }).redirect(redirectUri);
}
function _generateTokens(user) {
    return {
        accessToken: (0, tokenGenerators_1.generateAccessToken)(user),
        refreshToken: (0, tokenGenerators_1.generateRefreshToken)(user),
    };
}
function _sendResponseForAuthenticatedUser({ res, accessToken, refreshToken, user, }) {
    (0, setCookies_1.setRefreshTokenOnCookie)({
        res: (0, setCookies_1.setAccessTokenOnCookie)({ res: res.status(200), accessToken }),
        refreshToken,
    }).json({
        isAuthenticated: true,
        user: _getStrippedDownUser(user),
    });
}
function _getStrippedDownUser(user) {
    const { username, user_id, isAdmin } = user;
    return {
        username,
        userId: user_id,
        role: isAdmin ? "admin" : "user",
    };
}
