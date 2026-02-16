import { Axios } from ".";

export const getCalendarEventsPerUserId = async (filters) => {
  const result = await Axios.get("/calendar", {
    params: filters,
  });

  return result.data;
};

export const getCalendarEventsPerListing = async (listingId, filters = {}) => {
  const result = await Axios.get(`/calendar/per-listing/${listingId}`, {
    params: filters,
  });

  return result.data;
};
