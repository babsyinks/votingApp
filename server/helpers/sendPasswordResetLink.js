const sendEmail = require("./sendEmail");

async function sendPasswordResetLink({ toEmail, resetCode }) {
  const subject = "Reset your password";
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetCode}`;
  const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Reset Your Password</h2>
    <p style="font-size: 16px; color: #555;">
      We received a request to reset your password. Click the button below to proceed:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: #3b82f6; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 14px; color: #888;">
      If you didn't request this, you can safely ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #ddd;" />
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      &copy; ${new Date().getFullYear()} Corestack Technologies. All rights reserved.
    </p>
  </div>
`;

  await sendEmail({ toEmail, subject, htmlContent });
}

module.exports = sendPasswordResetLink;
