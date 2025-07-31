const emailTemplateBuilder = require("./emailTemplateBuilder");
const sendEmail = require("./sendEmail");

async function sendPasswordResetSuccessNotification({ toEmail }) {
  const subject = "Your password was successfully reset";
  const signinUrl = `${process.env.CLIENT_URL}/signin`;
  const helpUrl = `${process.env.CLIENT_URL}/help`;
  const htmlContent = emailTemplateBuilder({
    heading: "Password Reset Successful",
    content: [
      {
        message:
          "Your password has been successfully updated. If you initiated this change, no further action is needed. You can now sign in to your account.",
        linkDetails: { url: signinUrl, btnValue: "Sign In", isMainBtn: true },
      },
      {
        message:
          "<strong>Didn't request this change?</strong> Please contact our support team immediately. Your account's security is important to us.",
        linkDetails: { url: helpUrl, btnValue: "Contact Support", isMainBtn: false },
      },
    ],
    footNote:
      "You can also reset your password again if you suspect any unauthorized access by using the 'forgot password' link on the sign in page.",
  });

  await sendEmail({ toEmail, subject, htmlContent });
}

module.exports = sendPasswordResetSuccessNotification;
