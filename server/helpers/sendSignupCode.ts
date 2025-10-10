import sendEmail from "./sendEmail";

interface SendSignupCodeParams {
  toEmail: string;
  otpCode: string;
}

async function sendSignupCode({
  toEmail,
  otpCode,
}: SendSignupCodeParams): Promise<void> {
  await sendEmail({
    toEmail,
    subject: "Your One-Time Password (OTP)",
    htmlContent: `<p>Your OTP is <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`,
  });
}

export default sendSignupCode;
