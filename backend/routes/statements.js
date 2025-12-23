// routes/users.js
const express = require("express");
const StatementService = require("../services/statements");
const router = express.Router();

router.get("/", async (req, res) => {
  let statements = await StatementService.getStatements();

  statements = await Promise.all(
    statements.map(async (statement) => ({
      ...statement,
      ...(await StatementService.getStatementById(statement.id)),
    }))
  );

  res.send(statements);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const statement = await StatementService.getStatementById(id);

  res.send(statement);
});

module.exports = router;
