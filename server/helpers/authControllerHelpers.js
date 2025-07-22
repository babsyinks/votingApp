const bcrypt = require("bcryptjs");

const strongPasswordCriteria = require("../config/strongPasswordConf");
const generateCustomError = require("../utils/generateCustomError");
const { setAccessTokenOnCookie, setRefreshTokenOnCookie } = require("../utils/setCookies");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenGenerators");

const failIfEmpty = (fieldsObj) => {
  const keys = Object.keys(fieldsObj);
  const emptyField = [];
  if (
    keys.some((key) => {
      if (!fieldsObj[key]) emptyField.push(key);
      return !fieldsObj[key];
    })
  ) {
    generateCustomError(`${emptyField[0].toLowerCase()} field must be filled!`, 400);
  }
};

const failIfUserExists = (user) => {
  if (user) {
    generateCustomError("This User Exists Already!", 403);
  }
};

const failIfVerificationCodeIsNotValid = async (code, row) => {
  if (!row || !(await bcrypt.compare(code, row.codeHash))) {
    generateCustomError("Invalid or expired code", 403);
  }
};

const validateCredentials = async (user, password) => {
  let checkPassword;
  if (user) {
    checkPassword = await bcrypt.compare(password, user.password);
  }
  if (!user || !checkPassword) {
    generateCustomError("Wrong Username, Email or Password", 401);
  }
};

const hashPassWord = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
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

const sendResponseForAuthenticatedUser = ({ res, accessToken, refreshToken, user }) => {
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

const passwordStrengthStatus = (password) => {
  for (const { message, test } of strongPasswordCriteria) {
    if (!test(password)) return message;
  }
};

const failIfPasswordWeak = (password) => {
  const passwordStrengthStatusMessage = passwordStrengthStatus(password);
  if (passwordStrengthStatusMessage) {
    generateCustomError(`Password must have ${passwordStrengthStatusMessage.toLowerCase()}`, 400);
  }
};

module.exports = {
  failIfEmpty,
  failIfUserExists,
  validateCredentials,
  generateTokensAndSendResponse,
  generateTokensAndRedirect,
  failIfVerificationCodeIsNotValid,
  failIfPasswordWeak,
  hashPassWord,
};
