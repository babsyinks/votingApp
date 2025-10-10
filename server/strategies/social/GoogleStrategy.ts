import type { DoneCallback } from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import type { VerifyCallback } from "passport-oauth2";

import Social from "./Social";

class GoogleSocial extends Social {
  constructor(profile: Profile) {
    super(profile, "google");
  }
}

const verify = async (
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
): Promise<void> => {
  const strategy = new GoogleSocial(profile);
  try {
    await strategy.authenticate(done as DoneCallback);
  } catch (err) {
    done(err as Error);
  }
};

export default () =>
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "/api/v1/oauth/google/callback",
    },
    verify,
  );
