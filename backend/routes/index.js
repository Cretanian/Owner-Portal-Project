module.exports = function (app) {
  app.use("/statements", require("./statements"));
  app.use("/analytics", require("./analytics"));
};
