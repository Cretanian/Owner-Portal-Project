const Database = require("./database");

const db = Database(
  process.env.DB,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  process.env.DB_HOST,
);

module.exports = db;
