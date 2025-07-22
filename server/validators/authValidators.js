const bcrypt = require("bcryptjs");

const strongPasswordCriteria = require("../config/strongPasswordConf");
const generateCustomError = require("../utils/generateCustomError");

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

const _passwordStrengthStatus = (password) => {
  for (const { message, test } of strongPasswordCriteria) {
    if (!test(password)) return message;
  }
};

const failIfPasswordWeak = (password) => {
  const passwordStrengthStatusMessage = _passwordStrengthStatus(password);
  if (passwordStrengthStatusMessage) {
    generateCustomError(`Password must have ${passwordStrengthStatusMessage.toLowerCase()}`, 400);
  }
};

module.exports = {
  failIfEmpty,
  failIfUserExists,
  validateCredentials,
  failIfVerificationCodeIsNotValid,
  failIfPasswordWeak,
};
