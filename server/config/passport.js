const passport = require("passport");

const getFacebookStrategy = require("../strategies/social/FacebookStrategy");
const githubStrategy = require("../strategies/social/GitHubStrategy");
const getGoogleStrategy = require("../strategies/social/GoogleStrategy");

passport.use(getFacebookStrategy());
passport.use(githubStrategy());
passport.use(getGoogleStrategy());
