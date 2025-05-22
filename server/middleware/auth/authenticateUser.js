const path = require("path");

const jwt = require("jsonwebtoken");

const { User } = require("../../models");
require("dotenv").config({ path: path.join("..", ".env") });
require("dotenv").config({ debug: process.env.DEBUG });

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];
    let user;
    if (token) {
      const verifyObj = jwt.verify(token, process.env.TOKEN_SECRET);
      user = await User.findOne({ where: { user_id: verifyObj.user.id } });
    }
    if (!token || !user) {
      return res
        .status(401)
        .json({ authenticated: false, error: "authentication failed" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ authenticated: false, error: error.message });
  }
};

module.exports = authenticateUser;
