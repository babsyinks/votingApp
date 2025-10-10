import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import type { ValidUser } from "../helpers/types/validAuthUser";
import generateCustomError from "../utils/generateCustomError";
import { setAccessTokenOnCookie } from "../utils/setCookies";
import { generateAccessToken } from "../utils/tokenGenerators";

/**
 * Handles refresh token flow by verifying refresh_token cookie and
 * issuing a new access token if valid.
 */
export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      generateCustomError("Token Refresh Unauthorized!", 403);
    }

    // Verify the refresh token using the secret
    const decoded = jwt.verify(
      refreshToken as string,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as ValidUser | string;

    if (!decoded || typeof decoded === "string") {
      generateCustomError("Token Refresh Unauthorized!", 403);
    }

    // Generate a new access token for this user
    const accessToken = generateAccessToken(decoded);

    // Set cookie and send response
    setAccessTokenOnCookie({ res: res.status(200), accessToken }).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
