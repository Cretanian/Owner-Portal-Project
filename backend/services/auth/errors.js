class TokenError extends Error {
  constructor(message = "Invalid or missing token") {
    super(message);
    this.name = "TokenError";
  }
}

class InvalidSessionError extends Error {
  constructor(message = "User session has expired or is invalid") {
    super(message);
    this.name = "InvalidSessionError";
  }
}

module.exports = {
  TokenError,
  InvalidSessionError,
};
