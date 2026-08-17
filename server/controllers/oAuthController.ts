import { Request, Response, NextFunction, RequestHandler } from "express";

import {
  passportCallbackWrapper,
  getOauthStartMiddleware,
} from "../helpers/oAuthHelpers";
import type { UserAttributesWithRoles } from "../models/user";

// Google OAuth
export const googleOauthStart: RequestHandler = getOauthStartMiddleware(
  "google",
  {
    scope: ["email", "profile"],
  },
);

export const googleOauthConclude: RequestHandler =
  passportCallbackWrapper("google");

// Facebook OAuth
export const facebookOauthStart: RequestHandler = getOauthStartMiddleware(
  "facebook",
  {
    scope: ["email", "public_profile"],
  },
);

export const facebookOauthConclude: RequestHandler =
  passportCallbackWrapper("facebook");

// GitHub OAuth
export const githubOauthStart: RequestHandler = getOauthStartMiddleware(
  "github",
  {
    scope: ["user:email", "read:user"],
  },
);

export const githubOauthConclude: RequestHandler =
  passportCallbackWrapper("github");

// After OAuth success
export const getUserDetailsOnOauthSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = req.user as UserAttributesWithRoles;

    if (!user) {
      res
        .status(401)
        .json({ isAuthenticated: false, message: "No user found" });
      return;
    }

    const { username, user_id, role } = user;

    res.json({
      isAuthenticated: true,
      user: {
        username,
        userId: user_id,
        role,
      },
    });
  } catch (error) {
    next(error);
  }
};
