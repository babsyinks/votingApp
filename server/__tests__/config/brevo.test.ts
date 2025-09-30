jest.mock("sib-api-v3-sdk", () => {
  const mockApiClientInstance = {
    authentications: {
      "api-key": {},
    },
  };

  const ApiClient = {
    instance: mockApiClientInstance,
  };

  class TransactionalEmailsApi {
    sendTransacEmail() {}
  }

  return { ApiClient, TransactionalEmailsApi };
});

describe("brevo", () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.BREVO_API_KEY = "test-api-key";
  });

  it("should set the BREVO_API_KEY on the api-key authentication", () => {
    const SibApiV3Sdk = require("sib-api-v3-sdk");

    require("../../config/brevo");
    expect(SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey).toBe("test-api-key");
  });

  it("should export an instance of TransactionalEmailsApi", () => {
    const SibApiV3Sdk = require("sib-api-v3-sdk");

    const apiInstance = require("../../config/brevo");
    expect(apiInstance).toBeInstanceOf(SibApiV3Sdk.TransactionalEmailsApi);
  });
});
