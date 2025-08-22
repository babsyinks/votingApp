const passport = require("passport");

jest.mock("passport", () => ({
  authenticate: jest.fn(),
}));

jest.mock("../../strategies/common/oAuthCallbackHandler", () => ({
  sessionOff: { session: false },
  handleOauthCallback: jest.fn(() => jest.fn(() => "mockCallbackResult")),
}));

const {
  sessionOff,
  handleOauthCallback,
} = require("../../strategies/common/oAuthCallbackHandler");

const {
  passportCallbackWrapper,
  getOauthStartMiddleware,
} = require("../../helpers/oAuthControllerHelpers");

describe("oAuthControllerHelpers", () => {
  let req, res, next, fakeMiddleware;

  beforeEach(() => {
    req = { req: true };
    res = { res: true };
    next = jest.fn();
    fakeMiddleware = jest.fn();
    passport.authenticate.mockReturnValue(fakeMiddleware);
    jest.clearAllMocks();
  });

  describe("passportCallbackWrapper", () => {
    it("should call passport.authenticate with correct arguments", () => {
      const strategy = "google";
      const cbWrapper = passportCallbackWrapper(strategy);

      cbWrapper(req, res, next);

      expect(handleOauthCallback).toHaveBeenCalledTimes(1);
      const expectedCbReturn = handleOauthCallback.mock.results[0].value(req, res, next);

      expect(passport.authenticate).toHaveBeenCalledWith(
        strategy,
        sessionOff,
        expectedCbReturn
      );

      expect(fakeMiddleware).toHaveBeenCalledWith(req, res, next);
    });

    it("should allow custom callbackFactory", () => {
      const strategy = "facebook";
      const customCbFn = jest.fn(() => jest.fn(() => "customCbResult"));
      const cbWrapper = passportCallbackWrapper(strategy, customCbFn);

      cbWrapper(req, res, next);

      expect(customCbFn).toHaveBeenCalledTimes(1);
      const expectedCbReturn = customCbFn.mock.results[0].value(req, res, next);

      expect(passport.authenticate).toHaveBeenCalledWith(
        strategy,
        sessionOff,
        expectedCbReturn
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
