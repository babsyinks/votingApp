const express = require("express");
const jwt = require("jsonwebtoken");

const { setAccessTokenOnCookie } = require("../utils/setCookies");
const { generateAccessToken } = require("../utils/tokenGenerators");

const router = express.Router();

router.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) return res.sendStatus(403);

  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (!user) return res.sendStatus(403);
    const accessToken = generateAccessToken(user);
    setAccessTokenOnCookie({ res: res.status(200), accessToken }).json({
      success: true,
    });
  } catch {
    res.sendStatus(403);
  }
});

module.exports = router;
