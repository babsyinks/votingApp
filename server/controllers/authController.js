const { Op } = require("sequelize");

const {
  failIfEmpty,
  failIfUserExists,
  failIfVerificationCodeIsNotValid,
  validateCredentials,
  generateTokensAndSendResponse,
  failIfPasswordWeak,
  hashPassWord,
} = require("../helpers/authControllerHelpers");
const sendPasswordResetLink = require("../helpers/sendPasswordResetLink");
const sendSignupCode = require("../helpers/sendSignupCode");
const { User, Code } = require("../models");
const {
  getHashedDigitCode,
  generateRandomDigitsCode,
  generateRandomHexCode,
  getHashedHexCode,
} = require("../utils/randomCodeGenerator");

const requestSignUpCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    failIfEmpty({ email });
    const user = await User.findOne({ where: { email } });
    failIfUserExists(user);
    const code = generateRandomDigitsCode();
    await Code.create({
      email,
      codeHash: await getHashedDigitCode(code),
      type: "signup",
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    await sendSignupCode({ toEmail: email, otpCode: code });
    res.json({ success: true, email });
  } catch (e) {
    next(e);
  }
};

const verifySignUpCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const row = await Code.findOne({
      where: {
        email,
        type: "signup",
        expiresAt: { [Op.gte]: new Date() },
      },
      order: [["createdAt", "DESC"]],
    });
    await failIfVerificationCodeIsNotValid(code, row);
    await row.destroy();
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
};

const register = async (req, res, next) => {
  try {
    failIfEmpty(req.body);
    let { username, password, email, firstname, lastname } = req.body;
    failIfPasswordWeak(password);
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });
    failIfUserExists(existingUser);
    password = await hashPassWord(password);

    const user = await User.create({
      username,
      password,
      email,
      firstname,
      lastname,
      role: "user",
    });
    generateTokensAndSendResponse({ res, user });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const identity = username || email;
    const isUserName = identity === username;
    failIfEmpty({ [isUserName ? "username" : "email"]: identity, password });
    const user = await User.findOne({
      where: { [isUserName ? "username" : "email"]: identity },
    });
    await validateCredentials(user, password);
    generateTokensAndSendResponse({ res, user });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    failIfEmpty({ email });
    const user = await User.findOne({ where: { email } });
    const message = `A reset link has been sent to ${email}`;
    // intentionally conceal the fact that a user with this email does not exist.
    if (!user) return res.status(200).json({ message });
    const resetCode = generateRandomHexCode();
    await Code.create({
      email,
      codeHash: getHashedHexCode(resetCode),
      type: "password_reset",
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    await sendPasswordResetLink({ toEmail: email, resetCode });
    res.json({
      success: true,
      message: `Reset link has been sent to ${email}.`,
    });
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { resetCode, password } = req.body;
    const hash = getHashedHexCode(resetCode);
    const resetCodeRecord = await Code.findOne({
      where: {
        codeHash: hash,
        expiresAt: { [Op.gt]: new Date() },
      },
    });
    if (!resetCodeRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const user = await User.findOne({
      where: { email: resetCodeRecord.email },
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    user.password = await hashPassWord(password);
    await user.save();
    await resetCodeRecord.destroy(); // Invalidate token after use
    res.json({ message: "Password successfully updated" });
  } catch (e) {
    next(e);
  }
};

const signout = (req, res) => {
  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "Logged out" });
};

module.exports = {
  requestSignUpCode,
  verifySignUpCode,
  register,
  signin,
  forgotPassword,
  resetPassword,
  signout,
};
