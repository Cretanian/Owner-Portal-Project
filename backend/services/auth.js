const { User, Session, RefreshToken } = require("../models");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Axios = require("../utils/axios");

const {
  buildAccessTokenClaims,
  createAccessToken,
  createRefreshToken,
  splitRefreshToken,
  getRefreshTokenTTL,
} = require("./auth/utils");
const { InvalidSessionError } = require("./auth/errors");

const AuthService = {};

AuthService.setPassword = async (userId, password) => {
  const { data } = await Axios.get(`user/${userId}`);

  const hostAwayUser = data.result;
  if (!hostAwayUser) throw new Error("User not found");

  const user = await User.findByPk(userId);

  const hash = await bcrypt.hash(password, 10);

  if (user) await user.update({ hash });
  else
    await User.create({
      id: hostAwayUser.id,
      email: hostAwayUser.email,
      hash,
    });
};

AuthService.login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const passwordMatches = bcrypt.compareSync(password, user.hash);
  if (!passwordMatches) throw new Error("Invalid credentials");

  const now = new Date();
  const refreshTokenTTL = getRefreshTokenTTL();
  const sessionId = crypto.randomUUID();

  const refreshToken = await createRefreshToken();
  const expiresAt = new Date(now.getTime() + refreshTokenTTL * 1000);

  await Session.create({
    id: sessionId,
    userId: user.id,
    currentTokenId: refreshToken.tokenId,
    expiresAt,
    lastSeenAt: now,
  });

  await RefreshToken.create({
    id: refreshToken.tokenId,
    sessionId,
    secretHash: refreshToken.secretHash,
    parentId: null,
    usedAt: null,
    expiresAt,
  });

  const accessToken = createAccessToken({
    userId: user.id,
    sessionId,
    claims: buildAccessTokenClaims(user),
  });

  return {
    accessToken,
    refreshToken: refreshToken.token,
    userId: user.id,
    sessionId,
  };
};

AuthService.refreshAccessToken = async (refreshToken) => {
  const parsed = splitRefreshToken(refreshToken);
  if (!parsed) throw new InvalidSessionError();

  const { tokenId, secret } = parsed;

  const storedToken = await RefreshToken.findByPk(tokenId, {
    include: Session,
  });

  if (!storedToken || !storedToken.session) throw new InvalidSessionError();

  const session = storedToken.session;
  const now = new Date();

  if (session.isRevoked || session.expiresAt <= now)
    throw new InvalidSessionError();

  if (storedToken.expiresAt && storedToken.expiresAt <= now)
    throw new InvalidSessionError();

  if (storedToken.usedAt) throw new InvalidSessionError();

  if (session.currentTokenId !== tokenId) throw new InvalidSessionError();

  const secretMatches = bcrypt.compareSync(secret, storedToken.secretHash);
  if (!secretMatches) throw new InvalidSessionError();

  const newRefreshToken = await createRefreshToken();
  const newExpiresAt = new Date(now.getTime() + getRefreshTokenTTL() * 1000);

  await RefreshToken.create({
    id: newRefreshToken.tokenId,
    sessionId: session.id,
    secretHash: newRefreshToken.secretHash,
    parentId: tokenId,
    usedAt: null,
    expiresAt: newExpiresAt,
  });

  await RefreshToken.update(
    {
      usedAt: now,
      replacedBy: newRefreshToken.tokenId,
    },
    { where: { id: tokenId } },
  );

  await Session.update(
    {
      currentTokenId: newRefreshToken.tokenId,
      lastSeenAt: now,
      expiresAt: newExpiresAt,
    },
    { where: { id: session.id } },
  );

  const accessToken = createAccessToken({
    userId: session.userId,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken.token,
  };
};

AuthService.logout = async (refreshToken) => {
  const parsed = splitRefreshToken(refreshToken);
  if (!parsed) return false;

  const { tokenId, secret } = parsed;
  const storedToken = await RefreshToken.findByPk(tokenId, {
    include: Session,
  });
  if (!storedToken || !storedToken.session) return false;

  const secretMatches = bcrypt.compareSync(secret, storedToken.secretHash);
  if (!secretMatches) return false;

  const session = storedToken.session;
  const now = new Date();

  if (session.isRevoked || session.expiresAt <= now) return false;
  if (storedToken.expiresAt && storedToken.expiresAt <= now) return false;

  await Session.update(
    { isRevoked: true, revokedAt: now },
    { where: { id: session.id } },
  );
  return true;
};

module.exports = AuthService;
