const { Strategy: GitHubStrategy } = require("passport-github2");

const Social = require("./Social");

class GitHubSocial extends Social {
  constructor(profile) {
    super(profile, "github");
  }
}

module.exports = () =>
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      scope: ["user:email"], // To access verified email and profile info
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const strategy = new GitHubSocial(profile);
      return await strategy.authenticate(done);
    },
  );
