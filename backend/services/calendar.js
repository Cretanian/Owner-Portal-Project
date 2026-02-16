const Axios = require("../utils/axios");
const ListingService = require("./listings");

const CalendarService = {};

CalendarService.getCalendarEventsPerListingId = async (
  listingId,
  { startDate, endDate } = {},
) => {
  const year = new Date().getFullYear();

  startDate = (startDate && formatDate(new Date(startDate))) || `${year}-01-01`;
  endDate = (endDate && formatDate(new Date(endDate))) || `${year}-12-31`;

  console.log(startDate, endDate);

  const { data: response } = await Axios.get(`listings/${listingId}/calendar`, {
    params: { startDate, endDate, includeResources: 1 },
  });

  if (!response.status === "success") throw new Error();

  const days = response.result;

  const calendarEvents = [];

  let firstBlockedIndex = null;
  let firstBlockedDay = null;

  days.forEach((day, i) => {
    if (day.status === "reserved") {
      if (day.date === day.reservations[0].arrivalDate) {
        calendarEvents.push({
          type: "reserved",
          start: day.date,
          end:
            day.reservations[0].departureDate <= endDate
              ? day.reservations[0].departureDate
              : endDate,
          reservation: day.reservations[0],
        });
      }
    } else if (day.status === "blocked" || day.status === "hardBlock") {
      if (firstBlockedIndex === null) {
        firstBlockedIndex = i;
        firstBlockedDay = day;
      }
    } else {
      calendarEvents.push({
        type: "available",
        start: day.date,
        end: formatDate(getNextDay(day.date)),
        price: day.price,
        minimumStay: day.minimumStay,
      });
    }

    if (
      day.status !== "blocked" &&
      day.status !== "hardBlock" &&
      firstBlockedIndex !== null
    ) {
      calendarEvents.push({
        type: "blocked",
        start: firstBlockedDay.date,
        end: day.date,
      });

      firstBlockedIndex = null;
      firstBlockedDay = null;
    }
  });

  if (firstBlockedIndex !== null) {
    calendarEvents.push({
      type: "blocked",
      start: firstBlockedDay.date,
      end: formatDate(getNextDay(endDate)),
    });

    firstBlockedIndex = null;
    firstBlockedDay = null;
  }

  return calendarEvents;
};

CalendarService.getCalendarEventsPerUserId = async (
  userId,
  { startDate, endDate } = {},
) => {
  const listings = await ListingService.getListings(userId);

  const calendarEvents = await Promise.all(
    listings.map((listing) =>
      CalendarService.getCalendarEventsPerListingId(listing.id, {
        startDate,
        endDate,
      }),
    ),
  );

  return listings.map((listing, i) => ({
    ...listing,
    calendarEvents: calendarEvents[i],
  }));
};

function getNextDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + 1);

  return d;
}

const formatDate = (d) =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");

module.exports = CalendarService;
