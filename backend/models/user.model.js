/**
 * @typedef {import('sequelize').Sequelize} Sequelize
 * @typedef {import('sequelize').DataTypes} DataTypes
 * @typedef {import('./index')} Models
 *
 * @param {Sequelize} sequelize
 * @param {Models} models
 * @param {DataTypes} DataTypes
 */

module.exports = (sequelize, models, DataTypes) => {
  const User = sequelize.define("user", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },

    hash: { type: DataTypes.STRING, allowNull: false },
  });

  User.associate = (allModels) => {
    User.hasMany(allModels.Session, { foreignKey: "userId" });
  };

  return User;
};
