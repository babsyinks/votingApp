import passport from "passport";

import getFacebookStrategy from "../strategies/social/FacebookStrategy";
import githubStrategy from "../strategies/social/GitHubStrategy";
import getGoogleStrategy from "../strategies/social/GoogleStrategy";

passport.use(getFacebookStrategy());
passport.use(githubStrategy());
passport.use(getGoogleStrategy());
