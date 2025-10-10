import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import { VerifyFunction } from "passport-facebook";

import Social from "./Social";

class FacebookSocial extends Social {
  constructor(profile: Profile) {
    super(profile, "facebook", false);
  }
}

const verify: VerifyFunction = async (
  _accessToken,
  _refreshToken,
  profile,
  done,
) => {
  const strategy = new FacebookSocial(profile);
  await strategy.authenticate(done);
};

export default () =>
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID as string,
      clientSecret: process.env.FACEBOOK_APP_SECRET as string,
      callbackURL: "/api/v1/oauth/facebook/callback",
      profileFields: ["id", "emails", "name", "displayName"],
    },
    verify,
  );
