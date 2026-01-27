const { Sequelize } = require("sequelize");

module.exports = (db, dbUser, dbPass, dbHost = "localhost") => {
  const Database = {};

  if (!db || !dbUser || !dbPass)
    throw new Error("Database Error: Missing DB info.");

  Database.sequelize = new Sequelize(db, dbUser, dbPass, {
    dialect: "mysql",
    host: dbHost,
  });

  Database.authenticate = async () => {
    try {
      await Database.sequelize.authenticate();
      console.log("✓ Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
      throw error;
    }
  };

  Database.sync = async () => {
    try {
      await Database.sequelize.drop();
      await Database.sequelize.sync();

      console.log("✓ Database has been synced successfully.");
    } catch (error) {
      console.error("Unable to sync the database:", error);
      throw error;
    }
  };

  return Database;
};
