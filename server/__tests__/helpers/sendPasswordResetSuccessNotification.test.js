const sendPasswordResetSuccessNotification = require("../../helpers/sendPasswordResetSuccessNotification");
const emailTemplateBuilder = require("../../helpers/emailTemplateBuilder");
const sendEmail = require("../../helpers/sendEmail");

jest.mock("../../helpers/emailTemplateBuilder");
jest.mock("../../helpers/sendEmail");

describe("sendPasswordResetSuccessNotification", () => {
  const REAL_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...REAL_ENV };
    process.env.CLIENT_URL = "https://example.com";
  });

  afterAll(() => {
    process.env = REAL_ENV;
  });

  it("should build email and call sendEmail with correct parameters", async () => {
    emailTemplateBuilder.mockReturnValue("<p>Email HTML</p>");

    await sendPasswordResetSuccessNotification({
      toEmail: "user@example.com",
    });

    expect(emailTemplateBuilder).toHaveBeenCalledWith({
      heading: "Password Reset Successful",
      content: [
        {
          message:
            "Your password has been successfully updated. If you initiated this change, no further action is needed. You can now sign in to your account.",
          linkDetails: {
            url: "https://example.com/signin",
            btnValue: "Sign In",
            isMainBtn: true,
          },
        },
        {
          message:
            "<strong>Didn't request this change?</strong> Please contact our support team immediately. Your account's security is important to us.",
          linkDetails: {
            url: "https://example.com/help",
            btnValue: "Contact Support",
            isMainBtn: false,
          },
        },
      ],
      footNote:
        "You can also reset your password again if you suspect any unauthorized access by using the 'forgot password' link on the sign in page.",
    });

    expect(sendEmail).toHaveBeenCalledWith({
      toEmail: "user@example.com",
      subject: "Your password was successfully reset",
      htmlContent: "<p>Email HTML</p>",
    });
  });

  it("should propagate error if sendEmail throws", async () => {
    emailTemplateBuilder.mockReturnValue("<p>Email HTML</p>");
    sendEmail.mockRejectedValueOnce(new Error("Send failed"));

    await expect(
      sendPasswordResetSuccessNotification({
        toEmail: "fail@example.com",
      })
    ).rejects.toThrow("Send failed");
  });
});
