// routes/users.js
const express = require("express");
const AnalyticsService = require("../services/analytics");
const router = express.Router();

router.get("/metrics", async (req, res) => {
  const results = await AnalyticsService.getMetrics(req.query);

  return res.status(200).send(results);
});

router.get("/monthly", async (req, res) => {
  const results = await AnalyticsService.getMonthlyAnalytics(req.query);

  return res.status(200).send(results);
});

module.exports = router;
