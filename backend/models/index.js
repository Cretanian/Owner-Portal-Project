const Models = require("./models");
const db = require("../database");

const models = Models(db.sequelize);

module.exports = models;
