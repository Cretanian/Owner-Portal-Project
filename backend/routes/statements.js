// routes/users.js
const express = require("express");
const StatementService = require("../services/statements");
const { protectRoute } = require("../services/auth/middleware");
const router = express.Router();

router.get("/", protectRoute, async (req, res) => {
  const statements = await StatementService.getStatements(req.token.userId);

  res.send(statements);
});

router.get("/:id", protectRoute, async (req, res) => {
  const { id } = req.params;

  const statement = await StatementService.getStatementById(id);

  res.send(statement);
});

module.exports = router;
