module.exports = function (app) {
  app.use("/statements", require("./statements"));
  app.use("/analytics", require("./analytics"));
  app.use("/users", require("./users"));
  app.use("/auth", require("./auth"));
  app.use("/listings", require("./listings"));
  app.use("/calendar", require("./calendar"));
};
