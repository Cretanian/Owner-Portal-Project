const Axios = require("../utils/axios");

const ListingService = {};

ListingService.getListings = async (userId) => {
  const { data: response } = await Axios.get("listings", {
    params: { userId },
  });

  if (!response.status === "success") throw new Error();

  const listings = response.result;

  return listings;
};

module.exports = ListingService;
