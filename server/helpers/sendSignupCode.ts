const sendEmail = require("./sendEmail");

async function sendSignupCode({ toEmail, otpCode }) {
  const subject = "Your One-Time Password (OTP)";
  const htmlContent = `<p>Your OTP is <strong>${otpCode}</strong>. It will expire in 10 minutes.</p>`;
  await sendEmail({ toEmail, subject, htmlContent });
}

module.exports = sendSignupCode;
