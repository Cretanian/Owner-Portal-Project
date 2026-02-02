const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DEFAULT_ACCESS_TOKEN_TTL = 15 * 60; // seconds
const DEFAULT_REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60; // seconds

const getAccessTokenTTL = () =>
  Number.parseInt(process.env.ACCESS_TOKEN_TTL, 10) || DEFAULT_ACCESS_TOKEN_TTL;

const getRefreshTokenTTL = () =>
  Number.parseInt(process.env.REFRESH_TOKEN_TTL, 10) ||
  DEFAULT_REFRESH_TOKEN_TTL;

const buildAccessTokenClaims = (user) => {
  if (!user) return {};
  return {};
};

const createAccessToken = ({ userId, sessionId, claims = {} }) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("Missing JWT_SECRET");

  const payload = {
    userId,
    sessionId,
    ...claims,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: getAccessTokenTTL(),
  });
};

const createRefreshToken = async () => {
  const tokenId = crypto.randomUUID();
  const secret = crypto.randomBytes(48).toString("hex");
  const secretHash = await bcrypt.hash(secret, 10);

  return {
    tokenId,
    secret,
    secretHash,
    token: `${tokenId}.${secret}`,
  };
};

const splitRefreshToken = (token) => {
  if (!token || typeof token !== "string") return null;
  const [tokenId, secret] = token.split(".");
  if (!tokenId || !secret) return null;
  return { tokenId, secret };
};

module.exports = {
  buildAccessTokenClaims,
  createAccessToken,
  createRefreshToken,
  splitRefreshToken,
  getAccessTokenTTL,
  getRefreshTokenTTL,
};
