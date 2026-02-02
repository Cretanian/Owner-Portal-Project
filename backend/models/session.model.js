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
  const Session = sequelize.define("session", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },

    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    currentTokenId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    lastSeenAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    isRevoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    revokedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

  });

  Session.associate = (allModels) => {
    Session.belongsTo(allModels.User, { foreignKey: "userId" });
    Session.hasMany(allModels.RefreshToken, { foreignKey: "sessionId" });
  };

  return Session;
};
