const path = require("path");

const jwt = require("jsonwebtoken");

const { User } = require("../../models");
require("dotenv").config({ path: path.join("..", ".env") });
require("dotenv").config({ debug: process.env.DEBUG });

const checkAdminAuthorization = () => async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];
    const verifyObj = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findOne({ where: { user_id: verifyObj.user.id } });
    if (!user) {
      return res
        .status(403)
        .json({ authorized: false, error: "authorization denied!" });
    }
    if (user.dataValues.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        authorized: false,
        error: `${user.dataValues.username} is unauthorized to access this resource.`,
      });
    }
  } catch (error) {
    return res.status(403).json({ authorized: false, error: error.message });
  }
};

module.exports = checkAdminAuthorization;
