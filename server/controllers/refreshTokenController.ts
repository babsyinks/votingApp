const jwt = require("jsonwebtoken");

const generateCustomError = require("../utils/generateCustomError");
const { setAccessTokenOnCookie } = require("../utils/setCookies");
const { generateAccessToken } = require("../utils/tokenGenerators");

const refreshToken = (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    const user = refreshToken && jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!refreshToken || !user) generateCustomError("Token Refresh Unauthorized!", 403);
    const accessToken = generateAccessToken(user);
    setAccessTokenOnCookie({ res: res.status(200), accessToken }).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { refreshToken };
