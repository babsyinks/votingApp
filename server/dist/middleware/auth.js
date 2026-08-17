"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorizationStatus = exports.checkAuthenticationStatus = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
/**
 * Middleware to check if the user is authenticated.
 */
const checkAuthenticationStatus = async (req, res, next) => {
    await _handleAuth("authentication")(req, res, next);
};
exports.checkAuthenticationStatus = checkAuthenticationStatus;
/**
 * Middleware to check if the user is authorized (admin only).
 */
const checkAuthorizationStatus = async (req, res, next) => {
    await _handleAuth("authorization")(req, res, next);
};
exports.checkAuthorizationStatus = checkAuthorizationStatus;
/**
 * Shared handler for both authentication and authorization checks.
 */
function _handleAuth(statusType) {
    return async (req, res, next) => {
        const statusObj = _getAuthStatusObject(statusType);
        try {
            const token = req.cookies.access_token;
            const user = await _retrieveUser(token);
            if (!token || !user) {
                res
                    .status(statusObj.statusCode)
                    .json({ [statusObj.type]: false, error: statusObj.message });
                return;
            }
            if (statusType === "authorization") {
                const denied = _denyAuthorizationIfNotAdmin({ res, user });
                if (denied)
                    return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            res.status(401).json({ [statusObj.type]: false, error: message });
        }
    };
}
/**
 * Restricts access if user is not an admin.
 */
function _denyAuthorizationIfNotAdmin({ res, user, }) {
    if (user.role !== "admin") {
        res.status(403).json({
            authorized: false,
            error: `${user.username} is unauthorized to access this resource.`,
        });
        return true;
    }
    return false;
}
/**
 * Returns appropriate auth error message depending on type.
 */
function _getAuthStatusObject(statusType) {
    const authObj = {
        authentication: {
            statusCode: 401,
            message: "authentication failed!",
            type: "authenticated",
        },
        authorization: {
            statusCode: 403,
            message: "authorization denied!",
            type: "authorized",
        },
    };
    return authObj[statusType];
}
/**
 * Retrieves user from the access token.
 */
async function _retrieveUser(token) {
    if (!token)
        return null;
    const authObj = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { user_id } = authObj.user;
    if (!user_id)
        return null;
    const user = await models_1.User.findOne({ where: { user_id } });
    return user ? user.toJSON() : null;
}
