import SibApiV3Sdk from "sib-api-v3-sdk";

// Mock the SDK
jest.mock("sib-api-v3-sdk", () => {
  const mockAuth = { apiKey: "" };
  const mockClient = {
    authentications: { "api-key": mockAuth },
  };

  return {
    __esModule: true,
    default: {
      ApiClient: { instance: mockClient },
      TransactionalEmailsApi: jest.fn(() => ({ sendTransacEmail: jest.fn() })),
    },
  };
});

describe("Brevo config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // clears module cache between tests
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should configure the Brevo client with API key", () => {
    process.env.BREVO_API_KEY = "test-api-key";

    const apiInstance = require("../../config/brevo").default;

    // Verify API key was set
    const mockSdk = require("sib-api-v3-sdk").default;
    expect(
      mockSdk.ApiClient.instance.authentications["api-key"].apiKey
    ).toBe("test-api-key");

    // Verify TransactionalEmailsApi was instantiated
    expect(mockSdk.TransactionalEmailsApi).toHaveBeenCalledTimes(1);

    // And that the exported object is the instance
    expect(apiInstance).toEqual(expect.any(Object));
    expect(apiInstance.sendTransacEmail).toEqual(expect.any(Function));
  });

  it("should handle missing API key gracefully", () => {
    delete process.env.BREVO_API_KEY;

    const apiInstance = require("../../config/brevo").default;

    const mockSdk = require("sib-api-v3-sdk").default;
    expect(
      mockSdk.ApiClient.instance.authentications["api-key"].apiKey
    ).toBeUndefined();

    expect(apiInstance).toEqual(expect.any(Object));
  });
});
