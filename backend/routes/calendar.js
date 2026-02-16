const express = require("express");
const CalendarService = require("../services/calendar");
const { protectRoute } = require("../services/auth/middleware");
const router = express.Router();

router.get("/per-listing/:listingId", protectRoute, async (req, res) => {
  const calendarEvents = await CalendarService.getCalendarEventsPerListingId(
    req.params.listingId,
    req.query,
  );

  res.send(calendarEvents);
});

router.get("/", protectRoute, async (req, res) => {
  const calendarEvents = await CalendarService.getCalendarEventsPerUserId(
    req.token.userId,
    req.query,
  );

  res.send(calendarEvents);
});

module.exports = router;
