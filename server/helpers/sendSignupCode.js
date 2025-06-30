const apiInstance = require("../config/brevo");
const logger = require("../utils/logger");

async function sendSignupCode({ toEmail, otpCode }) {
  const sendSmtpEmail = {
    to: [{ email: toEmail }],
    sender: {
      name: "VoteNow Voting App",
      email: process.env.BREVO_VERIFIED_SENDER_EMAIL,
    },
    subject: "Your One-Time Password (OTP)",
    htmlContent: `<p>Your OTP is <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`,
  };

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    logger.info(`Email sent to ${toEmail}`, response);
  } catch (error) {
    logger.error(`Error sending email to ${toEmail}`, error);
  }
}

module.exports = sendSignupCode;
