import passport from "passport";
import type { Request, Response, NextFunction } from "express";

jest.mock("passport", () => ({
  authenticate: jest.fn(),
}));

jest.mock("../../helpers/oAuthCallbackHandler", () => ({
  sessionOff: { session: false },
  handleOauthCallback: jest.fn(() => jest.fn(() => "mockCallbackResult")),
}));

import {
  sessionOff,
  handleOauthCallback,
} from "../../helpers/oAuthCallbackHandler";

import {
  passportCallbackWrapper,
  getOauthStartMiddleware,
} from "../../helpers/oAuthControllerHelpers";

describe("oAuthControllerHelpers", () => {
  let req: Request,
    res: Response,
    next: NextFunction,
    fakeMiddleware: jest.Mock;

  beforeEach(() => {
    req = { req: true } as unknown as Request;
    res = { res: true } as unknown as Response;
    next = jest.fn();
    fakeMiddleware = jest.fn();
    (passport.authenticate as jest.Mock).mockReturnValue(fakeMiddleware);
    jest.clearAllMocks();
  });

  describe("passportCallbackWrapper", () => {
    it("should call passport.authenticate with correct arguments", () => {
      const strategy = "google";
      const cbWrapper = passportCallbackWrapper(strategy);

      cbWrapper(req, res, next);

      expect(handleOauthCallback).toHaveBeenCalledTimes(1);
      const expectedCbReturn = (
        handleOauthCallback as jest.Mock
      ).mock.results[0].value(req, res, next);

      expect(passport.authenticate).toHaveBeenCalledWith(
        strategy,
        sessionOff,
        expectedCbReturn,
      );

      expect(fakeMiddleware).toHaveBeenCalledWith(req, res, next);
    });

    it("should allow custom callbackFactory", () => {
      const strategy = "facebook";
      let customCbFn: typeof handleOauthCallback;
      customCbFn = jest.fn(() => jest.fn(() => "customCbResult")) as jest.Mock;
      const cbWrapper = passportCallbackWrapper(strategy, customCbFn);

      cbWrapper(req, res, next);

      expect(customCbFn).toHaveBeenCalledTimes(1);
      const expectedCbReturn = (customCbFn as jest.Mock).mock.results[0].value(
        req,
        res,
        next,
      );

      expect(passport.authenticate).toHaveBeenCalledWith(
        strategy,
        sessionOff,
        expectedCbReturn,
      );

      expect(fakeMiddleware).toHaveBeenCalledWith(req, res, next);
    });
  });

  describe("getOauthStartMiddleware", () => {
    it("should call passport.authenticate with session:false and no extra options", () => {
      const strategy = "google";
      const middleware = getOauthStartMiddleware(strategy);

      expect(passport.authenticate).toHaveBeenCalledWith(strategy, {
        session: false,
      });
      expect(middleware).toBe(fakeMiddleware);
    });

    it("should merge extra options with session:false", () => {
      const strategy = "github";
      const options = { scope: ["email"] };
      const middleware = getOauthStartMiddleware(strategy, options);

      expect(passport.authenticate).toHaveBeenCalledWith(strategy, {
        session: false,
        scope: ["email"],
      });
      expect(middleware).toBe(fakeMiddleware);
    });
  });
});
