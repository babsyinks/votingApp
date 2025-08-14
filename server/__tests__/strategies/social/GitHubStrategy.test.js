const mockAuthenticate = jest.fn();

jest.mock("passport-github2", () => ({
  Strategy: jest.fn().mockImplementation((_options, verify) => {
    mockStrategyInstance.verify = verify;
    return mockStrategyInstance;
  }),
}));

const mockStrategyInstance = { verify: null };

jest.mock("../../../strategies/social/Social", () => {
  return jest.fn().mockImplementation((_profile, strategyName, namesCombined) => ({
    profile: _profile,
    strategy: strategyName,
    namesCombined,
    authenticate: mockAuthenticate,
  }));
});

describe("GitHubStrategy factory", () => {
  let factory;
  let GitHubStrategy;
  let Social;

  const profile = { id: "gh123", username: "octocat" };
  const done = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules(); // reload module fresh

    process.env.GITHUB_CLIENT_ID = "test-client-id";
    process.env.GITHUB_CLIENT_SECRET = "test-client-secret";

    factory = require("../../../strategies/social/GitHubStrategy");
    GitHubStrategy = require("passport-github2").Strategy;
    Social = require("../../../strategies/social/Social");
  });

  it("should return a GitHubStrategy instance with correct config", () => {
    const strategyInstance = factory();

    expect(GitHubStrategy).toHaveBeenCalledWith(
      {
        clientID: "test-client-id",
        clientSecret: "test-client-secret",
        callbackURL: "/api/v1/oauth/github/callback",
        scope: ["user:email"],
      },
      expect.any(Function),
    );

    expect(strategyInstance).toBe(mockStrategyInstance);
  });

  it("should call GitHubSocial.authenticate with done when verify is called", async () => {
    factory();
    await mockStrategyInstance.verify("access", "refresh", profile, done);

    const calls = Social.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(profile);
    expect(calls[0][1]).toBe("github");
    expect(calls[0].length).toBe(2);

    expect(mockAuthenticate).toHaveBeenCalledWith(done);
  });
});
