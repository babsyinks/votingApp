const emailTemplateBuilder = require("./emailTemplateBuilder");
const sendEmail = require("./sendEmail");

async function sendPasswordResetLink({ toEmail, resetCode }) {
  const subject = "Reset your password";
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetCode}`;
  const htmlContent = emailTemplateBuilder({
    heading: "Reset Your Password",
    content: [
      {
        message: "We received a request to reset your password. Click the button below to proceed:",
        linkDetails: { url: resetUrl, btnValue: "Reset Password", isMainBtn: true },
      },
    ],
    footNote: "If you didn't request this, you can safely ignore this email.",
  });

  await sendEmail({ toEmail, subject, htmlContent });
}

module.exports = sendPasswordResetLink;
