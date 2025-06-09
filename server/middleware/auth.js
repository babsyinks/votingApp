const path = require("path");

const jwt = require("jsonwebtoken");

const { User } = require("../models");
require("dotenv").config({ path: path.join("..", ".env") });
require("dotenv").config({ debug: process.env.DEBUG });

const checkAuthenticationStatus = async (req, res, next) => {
  __handleAuth("authentication")(req, res, next);
};

const checkAuthorizationStatus = async (req, res, next) => {
  __handleAuth("authorization")(req, res, next);
};

const __handleAuth = (statusType) => {
  return async (req, res, next) => {
    const statusObj = __getAuthStatusObject(statusType);
    try {
      const token = req.cookies.access_token;
      const user = await __retrieveUser(token);
      if (!token || !user) {
        return res
          .status(statusObj.statusCode)
          .json({ [statusObj.type]: false, error: statusObj.message });
      }
      if (statusType === "authorization") {
        __denyAuthorizationIfNotAdmin({ res, user });
      }
      req.user = user;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ [statusObj.type]: false, error: error.message });
    }
  };
};

const __denyAuthorizationIfNotAdmin = ({ res, user }) => {
  if (user.role !== "admin") {
    return res.status(403).json({
      authorized: false,
      error: `${user.username} is unauthorized to access this resource.`,
    });
  }
};

const __getAuthStatusObject = (statusType) => {
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

const __retrieveUser = async (token) => {
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
