const sendPasswordResetLink = require("../../helpers/sendPasswordResetLink");
const emailTemplateBuilder = require("../../helpers/emailTemplateBuilder");
const sendEmail = require("../../helpers/sendEmail");

jest.mock("../../helpers/emailTemplateBuilder");
jest.mock("../../helpers/sendEmail");

describe("sendPasswordResetLink", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...OLD_ENV };
    process.env.CLIENT_URL = "https://example.com";
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should build email and call sendEmail with correct parameters", async () => {
    emailTemplateBuilder.mockReturnValue("<p>Email HTML</p>");

    await sendPasswordResetLink({
      toEmail: "user@example.com",
      resetCode: "abc123",
    });

    expect(emailTemplateBuilder).toHaveBeenCalledWith({
      heading: "Reset Your Password",
      content: [
        {
          message:
            "We received a request to reset your password. Click the button below to proceed:",
          linkDetails: {
            url: "https://example.com/reset-password/abc123",
            btnValue: "Reset Password",
            isMainBtn: true,
          },
        },
      ],
      footNote:
        "If you didn't request this, you can safely ignore this email.",
    });

    expect(sendEmail).toHaveBeenCalledWith({
      toEmail: "user@example.com",
      subject: "Reset your password",
      htmlContent: "<p>Email HTML</p>",
    });
  });

  it("should propagate error if sendEmail throws", async () => {
    emailTemplateBuilder.mockReturnValue("<p>Email HTML</p>");
    sendEmail.mockRejectedValueOnce(new Error("Send failed"));

    await expect(
      sendPasswordResetLink({
        toEmail: "fail@example.com",
        resetCode: "code123",
      })
    ).rejects.toThrow("Send failed");
  });
});
