const jwt = require("jsonwebtoken");

function generateAccessToken(user) {
  return generateToken({
    user,
    secret: "ACCESS_TOKEN_SECRET",
    expiresIn: "15m",
  });
}

function generateRefreshToken(user) {
  return generateToken({
    user,
    secret: "REFRESH_TOKEN_SECRET",
    expiresIn: "7d",
  });
}

function generateToken({ user, secret, expiresIn }) {
  return jwt.sign({ user: { user_id: user.user_id } }, process.env[secret], {
    expiresIn,
  });
}

module.exports = { generateAccessToken, generateRefreshToken };
