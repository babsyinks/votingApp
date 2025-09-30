const {
  passportCallbackWrapper,
  getOauthStartMiddleware,
} = require("../helpers/oAuthControllerHelpers");

const googleOauthStart = getOauthStartMiddleware("google", {
  scope: ["email", "profile"],
});

const googleOauthConclude = passportCallbackWrapper("google");

const facebookOauthStart = getOauthStartMiddleware("facebook", {
  scope: ["email", "public_profile"],
});

const facebookOauthConclude = passportCallbackWrapper("facebook");

const githubOauthStart = getOauthStartMiddleware("github", {
  scope: ["user:email", "read:user"],
});

const githubOauthConclude = passportCallbackWrapper("github");

const getUserDetailsOnOauthSuccess = async (req, res, next) => {
  try {
    const user = req.user;
    const { username, userId: user_id, role } = user;
    res.json({
      isAuthenticated: true,
      user: { username, userId: user_id, role },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  googleOauthStart,
  googleOauthConclude,
  facebookOauthStart,
  facebookOauthConclude,
  githubOauthStart,
  githubOauthConclude,
  getUserDetailsOnOauthSuccess,
};
