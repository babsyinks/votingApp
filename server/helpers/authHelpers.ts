import bcrypt from "bcryptjs";
import type { Response } from "express";

import type { MiniFiedUser } from "./types/minifiedUser.type";
import type { ValidUser } from "./types/validAuthUser";
import {
  setAccessTokenOnCookie,
  setRefreshTokenOnCookie,
} from "../utils/setCookies";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGenerators";

export async function hashPassWord(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export function generateTokensAndSendResponse({
  res,
  user,
}: {
  res: Response;
  user: ValidUser;
}): void {
  const { accessToken, refreshToken } = _generateTokens(user);
  _sendResponseForAuthenticatedUser({ res, accessToken, refreshToken, user });
}

export function generateTokensAndRedirect({
  res,
  user,
  redirectUri,
}: {
  res: Response;
  user: ValidUser;
  redirectUri: string;
}): void {
  const { accessToken, refreshToken } = _generateTokens(user);
  setRefreshTokenOnCookie({
    res: setAccessTokenOnCookie({ res, accessToken }),
    refreshToken,
  }).redirect(redirectUri);
}

function _generateTokens(user: ValidUser): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
}

function _sendResponseForAuthenticatedUser({
  res,
  accessToken,
  refreshToken,
  user,
}: {
  res: Response;
  accessToken: string;
  refreshToken: string;
  user: ValidUser;
}): void {
  setRefreshTokenOnCookie({
    res: setAccessTokenOnCookie({ res: res.status(200), accessToken }),
    refreshToken,
  }).json({
    isAuthenticated: true,
    user: _getStrippedDownUser(user),
  });
}

function _getStrippedDownUser(user: ValidUser) {
  const { username, user_id, isAdmin } = user;
  return {
    username,
    userId: user_id,
    role: isAdmin ? "admin" : "user",
  } as MiniFiedUser;
}
