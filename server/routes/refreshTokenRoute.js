const express = require("express");
const jwt = require("jsonwebtoken");

const { setAccessTokenOnCookie } = require("../utils/setCookies");
const { generateAccessToken } = require("../utils/tokenGenerators");

const router = express.Router();

router.post("/refresh", (req, res, next) => {
  try {
    const error = new Error("Access Denied!");
    error.statusCode = 403;
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) throw error;
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!user) throw error;
    const accessToken = generateAccessToken(user);
    setAccessTokenOnCookie({ res: res.status(200), accessToken }).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
