import type { Request, Response } from "express";

import { generateTokensAndRedirect } from "./authHelpers";
import type { User } from "../models";

const FAILURE_REDIRECT = `${process.env.CLIENT_URL}/signin`;
const SUCCESS_REDIRECT = `${process.env.CLIENT_URL}/oauth-success`;

export const sessionOff = { session: false };

interface HandleOauthCallbackOptions {
  successRedirectUri?: string;
  failureRedirectUri?: string;
}

export interface PassportError extends Error {
  errors?: { message: string }[];
}

export const handleOauthCallback = ({
  successRedirectUri = SUCCESS_REDIRECT,
  failureRedirectUri = FAILURE_REDIRECT,
}: HandleOauthCallbackOptions = {}) => {
  return (_req: Request, res: Response) =>
    (err: PassportError | null, user?: User) => {
      if (err || !user) {
        let errorMessage: string = err?.message || "Authentication failed";

        if (err?.errors) {
          errorMessage = err.errors.map((e) => e.message).join("; ");
        }

        return res.redirect(
          `${failureRedirectUri}?error=${encodeURIComponent(errorMessage)}`,
        );
      }

      return generateTokensAndRedirect({
        res,
        user,
        redirectUri: successRedirectUri,
      });
    };
};
