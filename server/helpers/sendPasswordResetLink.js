const sendEmail = require("./sendEmail");

async function sendPasswordResetLink({ toEmail, resetCode }) {
  const subject = "Reset your password";
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetCode}`;
  const htmlContent = `<p>Click to reset your password: ${resetUrl}</p>`;
  await sendEmail({ toEmail, subject, htmlContent });
}

module.exports = sendPasswordResetLink;
