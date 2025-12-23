module.exports = function (app) {
  app.use("/statements", require("./statements"));
};
