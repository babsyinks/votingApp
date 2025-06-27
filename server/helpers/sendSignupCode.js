const transporter = require("./mailTransporter");

async function sendSignupCode({ to, code }) {
  await transporter.sendMail({
    from: "'Demo Voting' <no-reply@demo-voting.com>",
    to,
    subject: "Your verification code",
    html: `<p>Your code is <strong>${code}</strong>. It expires in 10 minutes.</p>`,
  });
}

module.exports = sendSignupCode;
