import { Request, Response, NextFunction } from "express";
import passport, { AuthenticateOptions } from "passport";

import { sessionOff, handleOauthCallback } from "./oAuthCallbackHandler";

export const passportCallbackWrapper = (
  strategy: string,
  callbackFactory = handleOauthCallback,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(strategy, sessionOff, callbackFactory()(req, res))(
      req,
      res,
      next,
    );
  };
};

export const getOauthStartMiddleware = (
  strategy: string,
  options: AuthenticateOptions = {},
) => {
  return passport.authenticate(strategy, {
    session: false,
    ...options,
  });
};
