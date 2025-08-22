const path = require("path");

const jwt = require("jsonwebtoken");

const { User } = require("../models");
require("dotenv").config({ path: path.join("..", ".env") });
require("dotenv").config({ debug: process.env.DEBUG });

const checkAuthenticationStatus = async (req, res, next) => {
  await _handleAuth("authentication")(req, res, next);
};

const checkAuthorizationStatus = async (req, res, next) => {
  await _handleAuth("authorization")(req, res, next);
};

const _handleAuth = (statusType) => {
  return async (req, res, next) => {
    const statusObj = _getAuthStatusObject(statusType);
    try {
      const token = req.cookies.access_token;
      const user = await _retrieveUser(token);
      if (!token || !user) {
        return res
          .status(statusObj.statusCode)
          .json({ [statusObj.type]: false, error: statusObj.message });
      }
      if (statusType === "authorization") {
        _denyAuthorizationIfNotAdmin({ res, user });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ [statusObj.type]: false, error: error.message });
    }
  };
};

const _denyAuthorizationIfNotAdmin = ({ res, user }) => {
  if (user.role !== "admin") {
    return res.status(403).json({
      authorized: false,
      error: `${user.username} is unauthorized to access this resource.`,
    });
  }
};

const _getAuthStatusObject = (statusType) => {
  const authObj = {
    authentication: {
      statusCode: 401,
      message: "authentication failed!",
      type: "authenticated",
    },
    authorization: {
      statusCode: 403,
      message: "authorization denied!",
      type: "authorized",
    },
  };
  return authObj[statusType];
};

const _retrieveUser = async (token) => {
  let user;
  if (token) {
    const authObj = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { user_id } = authObj.user;
    if (user_id) {
      user = await User.findOne({ where: { user_id } });
    }
  }
  return user;
};

module.exports = { checkAuthenticationStatus, checkAuthorizationStatus };
