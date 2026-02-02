const express = require("express");
const AuthService = require("../services/auth");
const {
  getRefreshTokenTTL,
  getAccessTokenTTL,
} = require("../services/auth/utils");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  const result = await AuthService.login({ email, password });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: getRefreshTokenTTL() * 1000,
  });

  return res.json({
    accessToken: result.accessToken,
    userId: result.userId,
  });
});

router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || null;

  const result = await AuthService.refreshAccessToken(refreshToken);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: getRefreshTokenTTL() * 1000,
  });

  return res.json({
    accessToken: result.accessToken,
    ttl: getAccessTokenTTL() * 1000,
  });
});

router.post("/logout", async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || null;

  const result = await AuthService.logout(refreshToken);

  res.clearCookie("refreshToken");

  return res.json({ success: result });
});

module.exports = router;
