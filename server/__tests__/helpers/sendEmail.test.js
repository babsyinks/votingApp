const sendEmail = require("../../helpers/sendEmail");
const apiInstance = require("../../config/brevo");
const logger = require("../../utils/logger");

jest.mock("../../config/brevo", () => ({
  sendTransacEmail: jest.fn(),
}));

jest.mock("../../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("sendEmail", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    process.env.BREVO_VERIFIED_SENDER_EMAIL = "noreply@example.com";
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should send email and log success", async () => {
    const mockResponse = { messageId: "12345" };
    apiInstance.sendTransacEmail.mockResolvedValueOnce(mockResponse);

    await sendEmail({
      toEmail: "test@example.com",
      subject: "Test Subject",
      htmlContent: "<p>Hello</p>",
    });

    expect(apiInstance.sendTransacEmail).toHaveBeenCalledWith({
      to: [{ email: "test@example.com" }],
      sender: {
        name: "VoteNow Voting App",
        email: "noreply@example.com",
      },
      subject: "Test Subject",
      htmlContent: "<p>Hello</p>",
    });

    expect(logger.info).toHaveBeenCalledWith(
      "Email sent to test@example.com",
      mockResponse
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("should log error if sending fails", async () => {
    const mockError = new Error("SMTP error");
    apiInstance.sendTransacEmail.mockRejectedValueOnce(mockError);

    await sendEmail({
      toEmail: "fail@example.com",
      subject: "Fail Subject",
      htmlContent: "<p>Fail</p>",
    });

    expect(apiInstance.sendTransacEmail).toHaveBeenCalledWith({
      to: [{ email: "fail@example.com" }],
      sender: {
        name: "VoteNow Voting App",
        email: "noreply@example.com",
      },
      subject: "Fail Subject",
      htmlContent: "<p>Fail</p>",
    });

    expect(logger.error).toHaveBeenCalledWith(
      "Error sending email to fail@example.com",
      mockError
    );
    expect(logger.info).not.toHaveBeenCalled();
  });
});
