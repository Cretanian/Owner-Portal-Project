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
}) => {
  const formData = new FormData();

  formData.append("format", "csv");

  if (fromDate) formData.append("fromDate", fromDate);
  if (toDate) formData.append("toDate", toDate);
  if (dateType) formData.append("dateType", dateType);

  (listingMapIds || []).forEach((listingId, i) => {
    formData.append(`listingMapIds[${i}]`, listingId);
  });

  (statuses || []).forEach((status, i) => {
    formData.append(`statuses[${i}]`, status);
  });

  (channelIds || []).forEach((channelIds, i) => {
    formData.append(`statuses[${i}]`, channelIds);
  });

  return formData;
};

AnalyticsService.getMetrics = async (filters = {}) => {
  const formData = createFiltersFormData(filters);

  const { data } = await Axios.post(
    "finance/report/listingFinancials",
    formData
  );

  const financialData = CsvParser.parse(data, {
    header: true, // uses first row as keys
    skipEmptyLines: true,
  });

  const aggregatedData = financialData.data[financialData.data.length - 1];

  const interestedFields = [
    "Nights",
    "ownerPayout",
    "totalPrice",
    "totalTaxes",
    "paymentFees",
    "totalPayout",
  ];

  const result = {};

  interestedFields.forEach(
    (field) => (result[field] = Number(aggregatedData[field]))
  );

  return result;
};

module.exports = AnalyticsService;
