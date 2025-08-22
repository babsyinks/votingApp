const apiInstance = require("../config/brevo");
const logger = require("../utils/logger");

async function sendEmail({ toEmail, subject, htmlContent }) {
  const emailConf = {
    to: [{ email: toEmail }],
    sender: {
      name: "VoteNow Voting App",
      email: process.env.BREVO_VERIFIED_SENDER_EMAIL,
    },
    subject,
    htmlContent,
  };
  try {
    const response = await apiInstance.sendTransacEmail(emailConf);
    logger.info(`Email sent to ${toEmail}`, response);
  } catch (error) {
    logger.error(`Error sending email to ${toEmail}`, error);
  }
}

module.exports = sendEmail;
