jest.mock("passport", () => ({
  use: jest.fn(),
}));

jest.mock("../../strategies/social/FacebookStrategy", () =>
  jest.fn(() => "FacebookStrategyInstance"),
);
jest.mock("../../strategies/social/GitHubStrategy", () =>
  jest.fn(() => "GitHubStrategyInstance"),
);
jest.mock("../../strategies/social/GoogleStrategy", () =>
  jest.fn(() => "GoogleStrategyInstance"),
);

describe("passport config", () => {
  beforeEach(async () => {
    // Clear module cache and mock state so each test runs cleanly.
    jest.resetModules();
    jest.clearAllMocks();

    // Dynamically import the module under test AFTER mocks are in place.
    // This causes the top-level passport.use(...) calls in config/passport to run
    // with the mocked strategy factories and mocked passport.use.
    await import("../../config/passport");
  });

  it("should call each strategy factory once", () => {
    // Retrieve the mocked factory functions
    const getFacebookStrategy = jest.requireMock(
      "../../strategies/social/FacebookStrategy",
    ) as jest.Mock;
    const githubStrategy = jest.requireMock(
      "../../strategies/social/GitHubStrategy",
    ) as jest.Mock;
    const getGoogleStrategy = jest.requireMock(
      "../../strategies/social/GoogleStrategy",
    ) as jest.Mock;

    expect(getFacebookStrategy).toHaveBeenCalledTimes(1);
    expect(githubStrategy).toHaveBeenCalledTimes(1);
    expect(getGoogleStrategy).toHaveBeenCalledTimes(1);
  });

  it("should register each strategy with passport.use", () => {
    const passportMock = jest.requireMock("passport") as {
      use: jest.Mock;
    };

    expect(passportMock.use).toHaveBeenCalledWith("FacebookStrategyInstance");
    expect(passportMock.use).toHaveBeenCalledWith("GitHubStrategyInstance");
    expect(passportMock.use).toHaveBeenCalledWith("GoogleStrategyInstance");
  });

  it("should register exactly 3 strategies", () => {
    const passportMock = jest.requireMock("passport") as {
      use: jest.Mock;
    };
    expect(passportMock.use).toHaveBeenCalledTimes(3);
  });
});
