jest.mock("passport", () => ({
  use: jest.fn(),
}));

jest.mock("../../strategies/social/FacebookStrategy", () =>
  jest.fn(() => "FacebookStrategyInstance"),
);
jest.mock("../../strategies/social/GitHubStrategy", () => jest.fn(() => "GitHubStrategyInstance"));
jest.mock("../../strategies/social/GoogleStrategy", () => jest.fn(() => "GoogleStrategyInstance"));

describe("passport.js config", () => {
  let passport;
  let getFacebookStrategy;
  let githubStrategy;
  let getGoogleStrategy;

  beforeEach(() => {
    jest.resetModules();

    passport = require("passport");
    getFacebookStrategy = require("../../strategies/social/FacebookStrategy");
    githubStrategy = require("../../strategies/social/GitHubStrategy");
    getGoogleStrategy = require("../../strategies/social/GoogleStrategy");

    require("../../config/passport");
  });

  it("should call each strategy function once", () => {
    expect(getFacebookStrategy).toHaveBeenCalledTimes(1);
    expect(githubStrategy).toHaveBeenCalledTimes(1);
    expect(getGoogleStrategy).toHaveBeenCalledTimes(1);
  });

  it("should register each strategy with passport.use", () => {
    expect(passport.use).toHaveBeenCalledWith("FacebookStrategyInstance");
    expect(passport.use).toHaveBeenCalledWith("GitHubStrategyInstance");
    expect(passport.use).toHaveBeenCalledWith("GoogleStrategyInstance");
  });

  it("should register exactly 3 strategies", () => {
    expect(passport.use).toHaveBeenCalledTimes(3);
  });
});
