const { getTokenFromReq, verifyToken } = require("./computeVerifiedToken");
const { TokenError } = require("./errors");

const protectRoute = (req, _res, next) => {
  const token = getTokenFromReq(req);

  if (!token) return next(new TokenError("Missing access token"));

  try {
    req.token = verifyToken(token);

    return next();
  } catch (error) {
    return next(new TokenError("Invalid access token"));
  }
};

module.exports = { protectRoute };
