// routes/users.js
const express = require("express");
const UserService = require("../services/users");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await UserService.getAllUsers();

  res.send(users);
});

module.exports = router;
