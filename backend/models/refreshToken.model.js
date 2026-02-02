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
  const RefreshToken = sequelize.define("refreshToken", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    sessionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    secretHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    replacedBy: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    usedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  RefreshToken.associate = (allModels) => {
    RefreshToken.belongsTo(allModels.Session, { foreignKey: "sessionId" });
  };

  return RefreshToken;
};
