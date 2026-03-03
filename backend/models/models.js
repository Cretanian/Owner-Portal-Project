const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const models = {};

  models.User = require("./user.model.js")(sequelize, models, DataTypes);
  models.Session = require("./session.model.js")(sequelize, models, DataTypes);
  models.RefreshToken = require("./refreshToken.model.js")(
    sequelize,
    models,
    DataTypes,
  );

  Object.values(models).forEach((model) => {
    if (typeof model.associate === "function") model.associate(models);
  });

  return models;
};
