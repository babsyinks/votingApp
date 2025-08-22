const mockAuthenticate = jest.fn();

jest.mock("passport-google-oauth20", () => ({
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

describe("GoogleOAuth2Strategy factory", () => {
  let factory;
  let GoogleStrategy;
  let Social;

  const profile = { id: "g123", displayName: "Jane Doe" };
  const done = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
    process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";

    factory = require("../../../strategies/social/GoogleStrategy");
    GoogleStrategy = require("passport-google-oauth20").Strategy;
    Social = require("../../../strategies/social/Social");
  });

  it("should return a GoogleOAuth2Strategy instance with correct config", () => {
    const strategyInstance = factory();

    expect(GoogleStrategy).toHaveBeenCalledWith(
      {
        clientID: "test-google-client-id",
        clientSecret: "test-google-client-secret",
        callbackURL: "/api/v1/oauth/google/callback",
      },
      expect.any(Function)
    );

    expect(strategyInstance).toBe(mockStrategyInstance);
  });

  it("should call GoogleSocial.authenticate with done when verify is called", async () => {
    factory();
    await mockStrategyInstance.verify("access", "refresh", profile, done);

    const calls = Social.mock.calls;
    expect(calls.length).toBe(1);
    expect(calls[0][0]).toBe(profile);
    expect(calls[0][1]).toBe("google");
    expect(calls[0].length).toBe(2);

    expect(mockAuthenticate).toHaveBeenCalledWith(done);
  });
});
