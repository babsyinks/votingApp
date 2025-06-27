const { Strategy: GoogleOAuth2Strategy } = require("passport-google-oauth20");

const Social = require("./Social");

class GoogleSocial extends Social {
  constructor(profile) {
    super(profile, "google");
  }
}

module.exports = () =>
  new GoogleOAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const strategy = new GoogleSocial(profile);
      return await strategy.authenticate(done);
    },
  );
