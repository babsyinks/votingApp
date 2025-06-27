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
} = require("../helpers/authRouteHelpers");
const sendSignupCode = require("../helpers/sendSignupCode");
const { User, SignupToken } = require("../models");
const {
  getHashedCode,
  generateRandomCode,
} = require("../utils/randomCodeGenerator");

require("dotenv").config();
const FAILURE_REDIRECT = "/login";
const router = express.Router();
router.use(express.json());

router.post("/request-signup-code", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    failIfUserExists(user);
    const code = generateRandomCode();
    await SignupToken.create({
      email,
      codeHash: await getHashedCode(code),
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    await sendSignupCode({ to: email, code });
    res.json({ success: true, email });
  } catch (e) {
    next(e);
  }
});

router.post("/verify-signup-code", async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const row = await SignupToken.findOne({
      where: {
        email,
        expiresAt: { [Op.gte]: new Date() },
      },
      order: [["createdAt", "DESC"]],
    });
    await failIfVerificationCodeIsNotValid(code, row);
    res.json({ success: true, email });
  } catch (e) {
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    let { username, password, email, firstname, lastname } = req.body;
    failIfEmpty(username, password, email, firstname, lastname);
    let user = await User.findOne({ where: { username } });
    failIfUserExists(user);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({
      username,
      password,
      email,
      firstname,
      lastname,
    });
    generateTokensAndSendResponse({ res, user });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const identity = username || email;
    failIfEmpty(identity, password);
    const isUserName = identity === username;
    const user = await User.findOne({
      where: { [isUserName ? username : email]: identity },
    });
    await validateCredentials(user, password);
    generateTokensAndSendResponse({ res, user });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: FAILURE_REDIRECT }),
  (req, res) => {
    generateTokensAndSendResponse({ res, user: req.user });
  },
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] }),
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: FAILURE_REDIRECT }),
  (req, res) => {
    generateTokensAndSendResponse({ res, user: req.user });
  },
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: FAILURE_REDIRECT }),
  (req, res) => {
    generateTokensAndSendResponse({ res, user: req.user });
  },
);

router.post("/logout", (req, res) => {
  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .json({ message: "Logged out" });
});

module.exports = router;
