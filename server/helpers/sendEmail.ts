import apiInstance from "../config/brevo";
import logger from "../utils/logger";

export interface SendEmailParams {
  toEmail: string;
  subject: string;
  htmlContent: string;
}

async function sendEmail({
  toEmail,
  subject,
  htmlContent,
}: SendEmailParams): Promise<void> {
  const emailConf = {
    to: [{ email: toEmail }],
    sender: {
      name: "VoteNow Voting App",
      email: process.env.BREVO_VERIFIED_SENDER_EMAIL as string,
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

export default sendEmail;
