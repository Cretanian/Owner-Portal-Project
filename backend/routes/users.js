// routes/users.js
const express = require("express");

const UserService = require("../services/users");
const AuthService = require("../services/auth");
const { protectRoute } = require("../services/auth/middleware");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await UserService.getAllUsers();

  res.send(users);
});

router.get("/my-info", protectRoute, async (req, res) => {
  const user = await UserService.getUserById(req.token.userId);

  res.send(user);
});

router.put("/:userId/password", async (req, res) => {
  await AuthService.setPassword(req.params.userId, req.body.password);

  res.status(201).send();
});

module.exports = router;
