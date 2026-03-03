const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const Models = require("../models/models");

const USERS_FILE = path.resolve(__dirname, "users.json");

const loadUsers = () => {
  const raw = fs.readFileSync(USERS_FILE, "utf8");
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error("seeders/users.json must contain an array of users");
  }

  return parsed;
};

const validateUser = (user, index) => {
  if (!user || typeof user !== "object") {
    throw new Error(`Invalid user at index ${index}`);
  }

  if (!user.id || !user.email || !user.password) {
    throw new Error(
      `User at index ${index} must contain id, email and password`,
    );
  }
};

module.exports = {
  async up(queryInterface) {
    const users = loadUsers();
    const models = Models(queryInterface.sequelize);
    const { User } = models;

    for (let i = 0; i < users.length; i += 1) {
      validateUser(users[i], i);
    }

    for (const user of users) {
      const hash = await bcrypt.hash(String(user.password), 10);
      const id = String(user.id);
      const email = String(user.email);
      const existingUser = await User.findByPk(id);

      if (existingUser) {
        await existingUser.update({
          email,
          hash,
        });
      } else {
        await User.create({
          id,
          email,
          hash,
        });
      }
    }
  },

  async down(queryInterface) {
    const users = loadUsers();
    const models = Models({ sequelize: queryInterface.sequelize });
    const { User } = models;

    for (let i = 0; i < users.length; i += 1) {
      validateUser(users[i], i);
    }

    const ids = users.map((user) => String(user.id));
    await User.destroy({ where: { id: ids } });
  },
};
