"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccessTokenOnCookie = setAccessTokenOnCookie;
exports.setRefreshTokenOnCookie = setRefreshTokenOnCookie;
const cookieSettings = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
};
if (process.env.NODE_ENV === "production") {
    cookieSettings.secure = true;
    cookieSettings.sameSite = "none";
}
/**
 * Sets an access token as an HTTP-only cookie.
 *
 * @param res - Express response object
 * @param accessToken - The JWT access token
 */
function setAccessTokenOnCookie({ res, accessToken, }) {
    const settings = {
        ...cookieSettings,
        maxAge: 24 * 60 * 60 * 1000,
    }; // 1 day
    return res.cookie("access_token", accessToken, settings);
}
/**
 * Sets a refresh token as an HTTP-only cookie.
 *
 * @param res - Express response object
 * @param refreshToken - The JWT refresh token
 */
function setRefreshTokenOnCookie({ res, refreshToken, }) {
    const settings = {
        ...cookieSettings,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }; // 7 days
    return res.cookie("refresh_token", refreshToken, settings);
}
