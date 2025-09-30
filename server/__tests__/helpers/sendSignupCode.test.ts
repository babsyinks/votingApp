const sendSignupCode = require("../../helpers/sendSignupCode");
const sendEmail = require("../../helpers/sendEmail");

jest.mock("../../helpers/sendEmail");

describe("sendSignupCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call sendEmail with correct parameters", async () => {
    await sendSignupCode({ toEmail: "user@example.com", otpCode: "987654" });

    expect(sendEmail).toHaveBeenCalledWith({
      toEmail: "user@example.com",
      subject: "Your One-Time Password (OTP)",
      htmlContent:
        "<p>Your OTP is <strong>987654</strong>. It will expire in 10 minutes.</p>",
    });
  });

  it("should propagate error if sendEmail throws", async () => {
    sendEmail.mockRejectedValueOnce(new Error("Email send failed"));

    await expect(
      sendSignupCode({ toEmail: "fail@example.com", otpCode: "111111" })
    ).rejects.toThrow("Email send failed");
  });
});
