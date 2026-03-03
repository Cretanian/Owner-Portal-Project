require("dotenv").config();

const baseConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  host: process.env.DB_HOST || "localhost",
  dialect: "mysql",
};

if (process.env.DB_PORT) {
  baseConfig.port = Number(process.env.DB_PORT);
}

module.exports = {
  development: { ...baseConfig },
  test: { ...baseConfig },
  production: { ...baseConfig },
};
