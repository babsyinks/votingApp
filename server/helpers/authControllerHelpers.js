const bcrypt = require("bcryptjs");

const { setAccessTokenOnCookie, setRefreshTokenOnCookie } = require("../utils/setCookies");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenGenerators");

const hashPassWord = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const generateTokensAndSendResponse = ({ res, user }) => {
  const { accessToken, refreshToken } = _generateTokens(user);
  _sendResponseForAuthenticatedUser({ res, accessToken, refreshToken, user });
};

const generateTokensAndRedirect = ({ res, user, redirectUri }) => {
  const { accessToken, refreshToken } = _generateTokens(user);
  setRefreshTokenOnCookie({
    res: setAccessTokenOnCookie({ res, accessToken }),
    refreshToken,
  }).redirect(redirectUri);
};

const _generateTokens = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

const _sendResponseForAuthenticatedUser = ({ res, accessToken, refreshToken, user }) => {
  setRefreshTokenOnCookie({
    res: setAccessTokenOnCookie({ res: res.status(200), accessToken }),
    refreshToken,
  }).json({
    isAuthenticated: true,
    user: _getStrippedDownUser(user),
  });
};

const _getStrippedDownUser = ({ username, user_id, role }) => {
  return { username, userId: user_id, role };
};

module.exports = {
  generateTokensAndSendResponse,
  generateTokensAndRedirect,
  hashPassWord,
};
