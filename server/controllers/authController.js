const { generateTokensAndSendResponse } = require("../helpers/authControllerHelpers");
const sendPasswordResetLink = require("../helpers/sendPasswordResetLink");
const sendSignupCode = require("../helpers/sendSignupCode");
const { authService } = require("../services");
const {
  failIfEmpty,
  failIfUserExists,
  validateCredentials,
  failIfVerificationCodeIsNotValid,
  failIfPasswordWeak,
} = require("../validators/authValidators");

const requestSignUpCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    failIfEmpty({ email });
    const user = await authService.getUserByEmail(email);
    failIfUserExists(user);
    const code = await authService.createSignupCode(email);
    await sendSignupCode({ toEmail: email, otpCode: code });
    res.json({ success: true, email });
  } catch (e) {
    next(e);
  }
};

const verifySignUpCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const row = await authService.getLatestValidSignupCode(email);
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
    const { username, email, password, firstname, lastname } = req.body;
    failIfPasswordWeak(password);
    const existingUser = await authService.findExistingUser({ email, username });
    failIfUserExists(existingUser);
    const user = await authService.createUser({
      username,
      email,
      firstname,
      lastname,
      password,
    });
    generateTokensAndSendResponse({ res, user });
  } catch (e) {
    next(e);
  }
};

const signin = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const identity = username || email;
    const isUsername = Boolean(username);
    failIfEmpty({ [isUsername ? "username" : "email"]: identity, password });
    const user = await authService.getUserByIdentity({ email, username });
    await validateCredentials(user, password);
    generateTokensAndSendResponse({ res, user });
  } catch (e) {
    next(e);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    failIfEmpty({ email });
    const user = await authService.getUserByEmail(email);
    const message = `A reset link has been sent to ${email}`;
    if (!user) return res.status(200).json({ message });
    const resetCode = await authService.createResetCode(email);
    await sendPasswordResetLink({ toEmail: email, resetCode });
    res.json({ success: true, message });
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { resetCode, password } = req.body;
    const resetCodeRecord = await authService.findValidResetCodeRecord(resetCode);
    if (!resetCodeRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    await authService.updatePassword(resetCodeRecord.email, password);
    await resetCodeRecord.destroy();
    res.json({ message: "Password successfully updated" });
  } catch (e) {
    next(e);
  }
};

const signout = (req, res) => {
  res.clearCookie("access_token").clearCookie("refresh_token").json({ message: "Logged out" });
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
