const Axios = require("../utils/axios");
const CsvParser = require("papaparse");

const AnalyticsService = {};

const createFiltersFormData = ({
  "listingMapIds[]": listingMapIds,
  fromDate,
  toDate,
  dateType,
  "channelIds[]": channelIds,
  "statuses[]": statuses,
} = {}) => {
  const formData = new FormData();

  formData.append("format", "csv");

  if (fromDate) formData.append("fromDate", fromDate);
  if (toDate) formData.append("toDate", toDate);
  if (dateType) formData.append("dateType", dateType);

  if (listingMapIds && !Array.isArray(listingMapIds))
    listingMapIds = [listingMapIds];

  if (statuses && !Array.isArray(statuses)) statuses = [statuses];

  if (channelIds && !Array.isArray(channelIds)) channelIds = [channelIds];

  (listingMapIds || []).forEach((listingId, i) => {
    formData.append(`listingMapIds[${i}]`, listingId);
  });

  (statuses || []).forEach((status, i) => {
    formData.append(`statuses[${i}]`, status);
  });

  (channelIds || []).forEach((channelIds, i) => {
    formData.append(`channelIds[${i}]`, channelIds);
  });

  return formData;
};

AnalyticsService.getMetrics = async (filters = {}) => {
  const formData = createFiltersFormData(filters);

  const { data } = await Axios.post(
    "finance/report/listingFinancials",
    formData,
  );

  const financialData = CsvParser.parse(data, {
    header: true, // uses first row as keys
    skipEmptyLines: true,
  });

  const aggregatedData = financialData.data[financialData.data.length - 1];

  const interestedFields = ["rentalRevenue", "Nights"];

  const result = {};

  interestedFields.forEach(
    (field) => (result[field] = Number(aggregatedData[field])),
  );

  return result;
};

AnalyticsService.getMonthlyAnalytics = async (filters = {}) => {
  const formData = createFiltersFormData(filters);

  const { data } = await Axios.post("finance/report/consolidated", formData);

  const { data: reservations } = CsvParser.parse(data, {
    header: true, // uses first row as keys
    skipEmptyLines: true,
  });

  reservations.pop();

  const listingId2reservations = new Map();

  for (let reservation of reservations) {
    const id = reservation["Listing ID"];

    if (id === "0") continue;

    const listingReservations = listingId2reservations.get(id);

    if (!listingReservations) listingId2reservations.set(id, []);

    listingId2reservations.set(id, [
      ...listingId2reservations.get(id),
      reservation,
    ]);
  }

  const minDate = filters.fromDate
    ? new Date(filters.fromDate)
    : new Date(calculateMinDateOfReservations(reservations));

  const maxDate = filters.toDate
    ? new Date(filters.toDate)
    : new Date(calculateMaxDatesOfReservations(reservations));

  const minYear = minDate.getFullYear();
  const maxYear = maxDate.getFullYear();

  const listingTemplate = {};

  for (let year = minYear; year <= maxYear; ++year) {
    listingTemplate[year] = {};

    let minMonth = 0,
      maxMonth = 11;

    if (year === minYear) minMonth = minDate.getMonth();
    if (year === maxYear) maxMonth = maxDate.getMonth();

    for (let month = minMonth; month <= maxMonth; ++month) {
      listingTemplate[year][month] = {
        nights: 0,
        revenue: 0,
      };
    }
  }

  const results = {};

  const listingIds = listingId2reservations.keys();

  for (let listingId of listingIds) {
    results[listingId] = JSON.parse(JSON.stringify(listingTemplate));

    const reservations = listingId2reservations.get(listingId);

    for (let reservation of reservations) {
      const checkInDate = new Date(reservation["Check-in date"]);

      const revenuePerNight =
        Number(reservation.rentalRevenue) / Number(reservation.Nights);

      for (
        let nights = 0, date = checkInDate;
        nights < Number(reservation.Nights);
        ++nights, date.setDate(date.getDate() + 1)
      ) {
        const year = date.getFullYear();
        const month = date.getMonth();

        results[listingId][year][month].nights++;
        results[listingId][year][month].revenue += revenuePerNight;
      }
    }
  }

  return results;
};

AnalyticsService.getPerChannelAnalytics = async (filters = {}) => {
  const channelLabels = ["AirBnb", "Booking", "CHS"];
  const channelIds = [[2018], [2005], [2000, 2013]];

  const filtersPerChannel = channelIds.map((channelId, i) => {
    const filters_ = JSON.parse(JSON.stringify(filters));

    filters_["channelIds[]"] = channelId;

    return filters_;
  });

  const results = await Promise.all(
    filtersPerChannel.map(async (filters) => {
      const formData = createFiltersFormData(filters);

      const { data } = await Axios.post(
        "finance/report/listingFinancials",
        formData,
      );

      return data;
    }),
  );

  const parsedResults = results.map((data) =>
    CsvParser.parse(data, {
      header: true,
      skipEmptyLines: true,
    }),
  );

  const summedRows = parsedResults.map((parsed) =>
    parsed.data.find((row) => row["Listing ID"] === "0"),
  );

  const perChannelAnalytics = summedRows.map((row, i) => ({
    channel: channelLabels[i],
    channelIds: channelIds[i],
    nights: row ? row["Nights"] : 0,
    revenue: row ? row["rentalRevenue"] : 0,
  }));

  return perChannelAnalytics;
};

const calculateMinDateOfReservations = (reservations) => {
  return reservations.reduce(
    (min, item) => (item["Check-in date"] < min ? item["Check-in date"] : min),
    reservations[0]["Check-in date"],
  );
};

const calculateMaxDatesOfReservations = (reservations) => {
  return reservations.reduce(
    (max, item) =>
      item["Check-out date"] > max ? item["Check-out date"] : max,
    reservations[0]["Check-out date"],
  );
};

module.exports = AnalyticsService;
