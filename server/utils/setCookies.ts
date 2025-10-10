import { Response } from "express";

type CookieSettings = {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  maxAge?: number;
};

const cookieSettings: CookieSettings = {
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
export function setAccessTokenOnCookie({
  res,
  accessToken,
}: {
  res: Response;
  accessToken: string;
}) {
  const settings: CookieSettings = {
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
export function setRefreshTokenOnCookie({
  res,
  refreshToken,
}: {
  res: Response;
  refreshToken: string;
}) {
  const settings: CookieSettings = {
    ...cookieSettings,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }; // 7 days
  return res.cookie("refresh_token", refreshToken, settings);
}
