import { Request, Response, NextFunction } from "express";

import { generateTokensAndSendResponse } from "../helpers/authHelpers";
import sendPasswordResetLink from "../helpers/sendPasswordResetLink";
import sendPasswordResetSuccessNotification from "../helpers/sendPasswordResetSuccessNotification";
import sendSignupCode from "../helpers/sendSignupCode";
import { authService } from "../services";
import {
  failIfEmpty,
  failIfUserExists,
  validateCredentials,
  failIfVerificationCodeIsNotValid,
  failIfPasswordWeak,
} from "../validators/authValidators";

/**
 * Handles signup code request.
 */
export const requestSignUpCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as { email: string };
    failIfEmpty({ email });

    const user = await authService.getUserByEmail(email);
    failIfUserExists(user);

    const code = await authService.createSignupCode(email);
    await sendSignupCode({ toEmail: email, otpCode: code });

    res.json({ success: true, email });
  } catch (e) {
    next(e);
  }
};

/**
 * Verifies a signup code sent to user's email.
 */
export const verifySignUpCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, code } = req.body as { email: string; code: string };
    const row = await authService.getLatestValidSignupCode(email);
    await failIfVerificationCodeIsNotValid(code, row);

    await row!.destroy();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

/**
 * Registers a new user after verifying signup code.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    failIfEmpty(req.body);

    const { username, email, password, firstname, lastname } = req.body as {
      username: string;
      email: string;
      password: string;
      firstname: string;
      lastname: string;
    };

    failIfPasswordWeak(password);

    const existingUser = await authService.findExistingUser({
      email,
      username,
    });
    failIfUserExists(existingUser);

    const user = await authService.createUser({
      username,
      email,
      firstname,
      lastname,
      password,
    });

    generateTokensAndSendResponse({ res, user });
  } catch (e) {
    next(e);
  }
};

/**
 * Logs a user in using username or email and password.
 */
export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body as {
      username?: string;
      email?: string;
      password: string;
    };

    const identity = username || email;
    const isUsername = Boolean(username);
    failIfEmpty({ [isUsername ? "username" : "email"]: identity, password });

    const user = await authService.getUserByIdentity({ email, username });
    await validateCredentials(user, password);

    generateTokensAndSendResponse({ res, user: user! });
  } catch (e) {
    next(e);
  }
};

/**
 * Handles forgot-password flow — sends reset link if user exists.
 */
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as { email: string };
    failIfEmpty({ email });

    const user = await authService.getUserByEmail(email);
    const message = `A reset link has been sent to ${email}`;

    if (!user) return res.status(200).json({ message });
    const resetCode = await authService.createResetCode(email);
    await sendPasswordResetLink({ toEmail: email, resetCode });
    res.json({ success: true, message });
  } catch (e) {
    next(e);
  }
};

/**
 * Handles password reset confirmation and update.
 */
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { resetCode, password } = req.body as {
      resetCode: string;
      password: string;
    };

    const resetCodeRecord =
      await authService.findValidResetCodeRecord(resetCode);

    if (!resetCodeRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    await authService.updatePassword(resetCodeRecord.email, password);
    await resetCodeRecord.destroy();
    await sendPasswordResetSuccessNotification({
      toEmail: resetCodeRecord.email,
    });

    res.json({ message: "Password successfully updated" });
  } catch (e) {
    next(e);
  }
};

/**
 * Logs out user by clearing authentication cookies.
 */
export const signout = (req: Request, res: Response) => {
  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "Logged out" });
};

export default {
  requestSignUpCode,
  verifySignUpCode,
  register,
  signin,
  forgotPassword,
  resetPassword,
  signout,
};
