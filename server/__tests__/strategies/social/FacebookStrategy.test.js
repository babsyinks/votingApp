const mockAuthenticate = jest.fn();

jest.mock("passport-facebook", () => ({
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

describe("FacebookStrategy factory", () => {
  let factory;
  let FacebookStrategy;
  let Social;

  const profile = { id: "123", name: { givenName: "John", familyName: "Doe" } };
  const done = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    jest.resetModules();
    process.env.FACEBOOK_APP_ID = "test-app-id";
    process.env.FACEBOOK_APP_SECRET = "test-app-secret";

    factory = require("../../../strategies/social/FacebookStrategy");
    FacebookStrategy = require("passport-facebook").Strategy;
    Social = require("../../../strategies/social/Social");
  });

  it("should return a FacebookStrategy instance with correct config", () => {
    const strategyInstance = factory();

    expect(FacebookStrategy).toHaveBeenCalledWith(
      {
        clientID: "test-app-id",
        clientSecret: "test-app-secret",
        callbackURL: "/api/v1/oauth/facebook/callback",
        profileFields: ["id", "emails", "name", "displayName"],
      },
      expect.any(Function)
    );

    expect(strategyInstance).toBe(mockStrategyInstance);
  });

  it("should call FacebookSocial.authenticate with done when verify is called", async () => {
    factory();
    await mockStrategyInstance.verify("access", "refresh", profile, done);

    expect(Social).toHaveBeenCalledWith(profile, "facebook", false);
    expect(mockAuthenticate).toHaveBeenCalledWith(done);
  });
});
