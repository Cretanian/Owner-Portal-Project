const { DataTypes } = require("sequelize");

module.exports = (db) => {
  const models = {};

  models.User = require("./user.model.js")(db.sequelize, models, DataTypes);

  return models;
};
