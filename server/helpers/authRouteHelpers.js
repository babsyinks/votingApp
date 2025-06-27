const bcrypt = require("bcryptjs");

const {
  setAccessTokenOnCookie,
  setRefreshTokenOnCookie,
} = require("../utils/setCookies");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenGenerators");

const failIfEmpty = (...args) => {
  if (args.some((arg) => !arg)) {
    throw new Error("All fields must be filled!");
  }
};

const failIfUserExists = (user) => {
  if (user) {
    const error = new Error("This User Exists Already!");
    error.statusCode = 403;
    throw error;
  }
};

const failIfVerificationCodeIsNotValid = async (code, row) => {
  if (!row || !(await bcrypt.compare(code, row.codeHash))) {
    throw new Error("Invalid or expired code");
  }
};

const validateCredentials = async (user, password) => {
  let checkPassword;
  if (user) {
    checkPassword = await bcrypt.compare(password, user.password);
  }
  if (!user || !checkPassword) {
    const error = new Error("Wrong Username, Email or Password");
    error.statusCode = 401;
    throw error;
  }
};

const generateTokensAndSendResponse = ({ res, user }) => {
  const { accessToken, refreshToken } = generateTokens(user);
  sendResponseForAuthenticatedUser({ res, accessToken, refreshToken, user });
};

const generateTokens = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

const sendResponseForAuthenticatedUser = ({
  res,
  accessToken,
  refreshToken,
  user,
}) => {
  setRefreshTokenOnCookie({
    res: setAccessTokenOnCookie({ res: res.status(200), accessToken }),
    refreshToken,
  }).json({
    isAuthenticated: true,
    user: getStrippedDownUser(user),
  });
};

const getStrippedDownUser = ({ username, user_id, role }) => {
  return { username, userId: user_id, role };
};

module.exports = {
  failIfEmpty,
  failIfUserExists,
  validateCredentials,
  generateTokensAndSendResponse,
  failIfVerificationCodeIsNotValid,
};
