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
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM,
      values: ["ADMIN", "OWNER"],
      defaultValue: "OWNER",
      allowNull: false,
    },

    hash: { type: DataTypes.STRING, allowNull: false },
  });

  return User;
};
