const express = require("express");
const ListingService = require("../services/listings");
const { protectRoute } = require("../services/auth/middleware");
const router = express.Router();

router.get("/", protectRoute, async (req, res) => {
  const listings = await ListingService.getListings(req.token.userId);

  res.send(listings);
});

module.exports = router;
