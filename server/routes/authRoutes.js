const bcrypt = require("bcryptjs");
const express = require("express");

const { User } = require("../models");
const {
  setAccessTokenOnCookie,
  setRefreshTokenOnCookie,
} = require("../utils/setCookies");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenGenerators");

require("dotenv").config();
const router = express.Router();
router.use(express.json());

router.post("/register", async (req, res, next) => {
  try {
    let { username, password } = req.body;
    failIfUsernameAndPasswordNotSet(username, password);
    let user = await User.findOne({ where: { username } });
    failRegistrationIfUserExists(user);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({ username, password });
    generateTokensAndSendResponse({ res, user });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    failIfUsernameAndPasswordNotSet(username, password);
    const user = await User.findOne({ where: { username } });
    await validateCredentials(user, password);
    generateTokensAndSendResponse({ res, user });
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

const failIfUsernameAndPasswordNotSet = (username, password) => {
  if (!username || !password) {
    throw new Error("Provide Username and Password!");
  }
};

const failRegistrationIfUserExists = (user) => {
  if (user) {
    const error = new Error("Username Exists! Choose Another Username!");
    error.statusCode = 403;
    throw error;
  }
};

const validateCredentials = async (user, password) => {
  let checkPassword;
  if (user) {
    checkPassword = await bcrypt.compare(password, user.password);
  }
  if (!user || !checkPassword) {
    const error = new Error("Wrong Username or Password");
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

module.exports = router;
