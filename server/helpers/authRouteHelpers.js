const bcrypt = require("bcryptjs");

const strongPasswordCriteria = require("../config/strongPasswordConf");
const {
  setAccessTokenOnCookie,
  setRefreshTokenOnCookie,
} = require("../utils/setCookies");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenGenerators");

const failIfEmpty = (fieldsObj) => {
  const keys = Object.keys(fieldsObj);
  const emptyField = [];
  if (
    keys.some((key) => {
      if (!fieldsObj[key]) emptyField.push(key);
      return !fieldsObj[key];
    })
  ) {
    throw new Error(`${emptyField[0].toLowerCase()} field must be filled!`);
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

const generateTokensAndRedirect = ({ res, user, redirectUri }) => {
  const { accessToken, refreshToken } = generateTokens(user);
  setRefreshTokenOnCookie({
    res: setAccessTokenOnCookie({ res, accessToken }),
    refreshToken,
  }).redirect(redirectUri);
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

const passwordStrenghtStatus = (password) => {
  for (const { message, test } of strongPasswordCriteria) {
    if (!test(password)) return message;
  }
};

module.exports = {
  failIfEmpty,
  failIfUserExists,
  validateCredentials,
  generateTokensAndSendResponse,
  generateTokensAndRedirect,
  failIfVerificationCodeIsNotValid,
  passwordStrenghtStatus,
};
