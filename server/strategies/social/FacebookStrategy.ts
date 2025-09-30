const { Strategy: FacebookStrategy } = require("passport-facebook");

const Social = require("./Social");

class FacebookSocial extends Social {
  constructor(profile) {
    super(profile, "facebook", false);
  }
}

module.exports = () =>
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/v1/oauth/facebook/callback",
      profileFields: ["id", "emails", "name", "displayName"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const strategy = new FacebookSocial(profile);
      return await strategy.authenticate(done);
    },
  );
