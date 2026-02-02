const jwt = require("jsonwebtoken");

const getTokenFromReq = (req) => {
  const header = req.headers?.authorization || "";

  if (header.startsWith("Bearer ")) return header.slice(7);

  if (req.body?.accessToken) return req.body.accessToken;
  if (req.query?.accessToken) return req.query.accessToken;
  if (req.params?.accessToken) return req.params.accessToken;

  return null;
};

const verifyToken = (token) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error("Missing JWT_SECRET");
  return jwt.verify(token, jwtSecret);
};

module.exports = { getTokenFromReq, verifyToken };
