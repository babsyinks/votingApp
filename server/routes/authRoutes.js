const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
require("dotenv").config();
const Router = express.Router();
Router.use(express.json());

Router.post("/register", async (req, res, next) => {
  try {
    let { username, password } = req.body;
    failIfUsernameAndPasswordNotSet(username, password);
    let user = await User.findOne({ where: { username } });
    failRegistrationIfUserExists(user);
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user = await User.create({ username, password });
    const token = generateToken(user);
    res.status(200).json({ token, user: getStrippedDownUser(user) });
  } catch (error) {
    next(error);
  }
});

Router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    failIfUsernameAndPasswordNotSet(username, password);
    const user = await User.findOne({ where: { username } });
    await validateCredentials(user, password);
    const token = generateToken(user);
    res.status(200).json({ token, user: getStrippedDownUser(user) });
  } catch (error) {
    next(error);
  }
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

const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user.dataValues.user_id } },
    process.env.TOKEN_SECRET,
    { expiresIn: 24 * 60 * 60 * 1000 },
  );
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

const getStrippedDownUser = ({ username, user_id, role }) => {
  return { username, userId: user_id, role };
};

module.exports = Router;
