import { Strategy as GitHubStrategy, Profile } from "passport-github2";

import Social from "./Social";

class GitHubSocial extends Social {
  constructor(profile: Profile) {
    super(profile, "github");
  }
}

const verify = async (
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: (err: unknown, user?: unknown) => void,
): Promise<void> => {
  const strategy = new GitHubSocial(profile);
  try {
    await strategy.authenticate(done);
  } catch (err) {
    done(err, null);
  }
};

export default () =>
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: "/api/v1/oauth/github/callback",
      scope: ["user:email"], // To access verified email and profile info
    },
    verify,
  );
