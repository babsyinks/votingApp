const bcrypt = require("bcryptjs");
const express = require("express");
const passport = require("passport");
const { Op } = require("sequelize");

const {
  failIfEmpty,
  failIfUserExists,
  failIfVerificationCodeIsNotValid,
  validateCredentials,
  generateTokensAndSendResponse,
  passwordStrengthStatus,
} = require("../helpers/authRouteHelpers");
const sendSignupCode = require("../helpers/sendSignupCode");
const { checkAuthenticationStatus } = require("../middleware/auth");
const { User, Code } = require("../models");
const {
  sessionOff,
  handleOauthCallback,
} = require("../strategies/common/oAuthCallbackHandler");
const {
  getHashedDigitCode,
  generateRandomDigitsCode,
  generateRandomHexCode,
  getHashedHexCode,
} = require("../utils/randomCodeGenerator");

const router = express.Router();
router.use(express.json());

router.post("/request-signup-code", async (req, res, next) => {
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
    await sendSignupCode({ toEmail: email, otpCode: code }); //
    res.json({ success: true, email });
  } catch (e) {
    next(e);
  }
});

router.post("/verify-signup-code", async (req, res, next) => {
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
});

router.post("/register", async (req, res, next) => {
  try {
    failIfEmpty(req.body);
    let { username, password, email, firstname, lastname } = req.body;
    const passwordStrengthStatusMessage = passwordStrengthStatus(password);
    if (passwordStrengthStatusMessage) {
      return res.status(400).json({
        message: `Password must have ${passwordStrengthStatusMessage.toLowerCase()}`,
      });
    }
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: "Username is already taken." });
      }
      if (existingUser.email === email) {
        return res
          .status(400)
          .json({ message: "Email is already registered." });
      }
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

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
});

router.post("/signin", async (req, res, next) => {
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
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  }),
);

router.get("/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    sessionOff,
    handleOauthCallback()(req, res, next),
  )(req, res, next);
});

router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
    session: false,
  }),
);

router.get("/facebook/callback", (req, res, next) => {
  passport.authenticate(
    "facebook",
    sessionOff,
    handleOauthCallback()(req, res, next),
  )(req, res, next);
});

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["user:email", "read:user"],
    session: false,
  }),
);

router.get("/github/callback", (req, res, next) => {
  passport.authenticate(
    "github",
    sessionOff,
    handleOauthCallback()(req, res, next),
  )(req, res, next);
});

router.get("/me", checkAuthenticationStatus, async (req, res, next) => {
  try {
    const user = req.user;
    const { username, userId: user_id, role } = user;
    res.json({
      isAuthenticated: true,
      user: { username, userId: user_id, role },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", (req, res) => {
  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "Logged out" });
});

module.exports = router;
