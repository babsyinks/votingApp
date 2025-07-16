const { generateTokensAndRedirect } = require("../../helpers/authRouteHelpers");

const FAILURE_REDIRECT = `${process.env.CLIENT_URL}/signin`;
const SUCCESS_REDIRECT = `${process.env.CLIENT_URL}/oauth-success`;

const sessionOff = { session: false };

const handleOauthCallback = ({
  successRedirectUri = SUCCESS_REDIRECT,
  failureRedirectUri = FAILURE_REDIRECT,
} = {}) => {
  return (req, res, next) => (err, user, info) => {
    if (err || !user) {
      let errorMessage = err?.message || "Authentication failed";
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

module.exports = {
  sessionOff,
  handleOauthCallback,
};
