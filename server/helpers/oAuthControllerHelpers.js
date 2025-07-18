const passport = require("passport");

const {
  sessionOff,
  handleOauthCallback,
} = require("../strategies/common/oAuthCallbackHandler");

const passportCallbackWrapper = (
  strategy,
  callbackFactory = handleOauthCallback,
) => {
  return (req, res, next) => {
    passport.authenticate(
      strategy,
      sessionOff,
      callbackFactory()(req, res, next),
    )(req, res, next);
  };
};

const getOauthStartMiddleware = (strategy, options = {}) => {
  return passport.authenticate(strategy, {
    session: false,
    ...options,
  });
};

module.exports = { passportCallbackWrapper, getOauthStartMiddleware };
