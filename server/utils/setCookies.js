const cookieSettings = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") {
  cookieSettings.secure = true;
  cookieSettings.sameSite = "none";
}

function setAccessTokenOnCookie({ res, accessToken }) {
  cookieSettings.maxAge = 24 * 60 * 60 * 1000;
  return res.cookie("access_token", accessToken, cookieSettings);
}

function setRefreshTokenOnCookie({ res, refreshToken }) {
  cookieSettings.maxAge = 7 * 24 * 60 * 60 * 1000;
  return res.cookie("refresh_token", refreshToken, cookieSettings);
}

module.exports = { setAccessTokenOnCookie, setRefreshTokenOnCookie };
