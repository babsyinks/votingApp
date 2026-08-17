import emailTemplateBuilder from "./emailTemplateBuilder";
import sendEmail from "./sendEmail";

interface SendPasswordResetLinkParams {
  toEmail: string;
  resetCode: string;
}

async function sendPasswordResetLink({
  toEmail,
  resetCode,
}: SendPasswordResetLinkParams): Promise<void> {
  const subject = "Reset your password";
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetCode}`;
  const htmlContent = emailTemplateBuilder({
    heading: "Reset Your Password",
    content: [
      {
        message:
          "We received a request to reset your password. Click the button below to proceed:",
        linkDetails: {
          url: resetUrl,
          btnValue: "Reset Password",
          isMainBtn: true,
        },
      },
    ],
    footNote: "If you didn't request this, you can safely ignore this email.",
  });
  await sendEmail({ toEmail, subject, htmlContent });
}

sendPasswordResetLink({
  toEmail: "babawarunn@yahoo.com",
  resetCode: "123456",
}).then((res) => {
  console.log("done");
});

export default sendPasswordResetLink;
