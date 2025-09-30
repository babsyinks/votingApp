const {
  handleOauthCallback,
  sessionOff,
} = require("../../../strategies/common/oAuthCallbackHandler");
const { generateTokensAndRedirect } = require("../../../helpers/authControllerHelpers");

jest.mock("../../../helpers/authControllerHelpers", () => ({
  generateTokensAndRedirect: jest.fn(),
}));

describe("oAuthCallbackHandler", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {
      redirect: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should export sessionOff with session set to false", () => {
    expect(sessionOff).toEqual({ session: false });
  });

  describe("failure cases", () => {
    it("should redirect to failure URL with default message if no user", () => {
      const handler = handleOauthCallback();
      handler(req, res, next)(null, null, null);

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringMatching(/\/signin\?error=Authentication%20failed/),
      );
    });

    it("should redirect to failure URL with error message from err.message", () => {
      const handler = handleOauthCallback();
      const err = new Error("Something went wrong");

      handler(req, res, next)(err, null, null);

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringMatching(/\/signin\?error=Something%20went%20wrong/),
      );
    });

    it("should redirect to failure URL with joined error messages if err.errors exists", () => {
      const handler = handleOauthCallback();
      const err = {
        errors: [{ message: "First error" }, { message: "Second error" }],
      };

      handler(req, res, next)(err, null, null);

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringMatching(/\/signin\?error=First%20error%3B%20Second%20error/),
      );
    });

    it("should use custom failureRedirectUri when provided", () => {
      const handler = handleOauthCallback({
        failureRedirectUri: "http://custom-fail.com/fail",
      });

      handler(req, res, next)(null, null, null);

      expect(res.redirect).toHaveBeenCalledWith(
        expect.stringMatching(/^http:\/\/custom-fail\.com\/fail\?error=Authentication%20failed/),
      );
    });
  });

  describe("success cases", () => {
    it("should call generateTokensAndRedirect with user and successRedirectUri", () => {
      const handler = handleOauthCallback();
      const user = { id: 123 };

      handler(req, res, next)(null, user, null);

      expect(generateTokensAndRedirect).toHaveBeenCalledWith({
        res,
        user,
        redirectUri: expect.stringMatching(/\/oauth-success$/),
      });
    });

    it("should use custom successRedirectUri when provided", () => {
      const handler = handleOauthCallback({
        successRedirectUri: "http://custom-success.com/welcome",
      });
      const user = { id: 456 };

      handler(req, res, next)(null, user, null);

      expect(generateTokensAndRedirect).toHaveBeenCalledWith({
        res,
        user,
        redirectUri: "http://custom-success.com/welcome",
      });
    });
  });
});
