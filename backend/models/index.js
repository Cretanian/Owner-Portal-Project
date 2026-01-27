const Models = require("./models");
const db = require("../database");

const models = Models(db);

module.exports = models;
