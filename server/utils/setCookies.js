function setAccessTokenOnCookie({ res, accessToken }) {
  return res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  });
}

function setRefreshTokenOnCookie({ res, refreshToken }) {
  return res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

module.exports = { setAccessTokenOnCookie, setRefreshTokenOnCookie };
