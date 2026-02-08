const Axios = require("../utils/axios");

const StatementService = {};

StatementService.getStatements = async (userId) => {
  const { data: response } = await Axios.get("/ownerStatements");

  if (!response.status === "success") throw new Error();

  let statements = response.result;

  statements = await Promise.all(
    statements.map(async (statement) => ({
      ...statement,
      ...(await StatementService.getStatementById(statement.id)),
    })),
  );

  statements = statements.filter(
    (statement) => `${statement.propertyOwnerId}` === `${userId}`,
  );

  return statements;
};

StatementService.getStatementById = async (id) => {
  const { data: response } = await Axios.get(`/ownerStatement/${id}`);

  if (!response.status === "success") throw new Error();

  const statement = response.result;

  return {
    ...statement,
    bookings: StatementService.extractStatementBookings(statement),
  };
};

StatementService.extractStatementBookings = (statement) => {
  const tableColumns = [
    "listingName",
    "guestName",
    "channelName",
    "arrivalDate",
    "departureDate",
    "numberOfGuests",
    "nights",
    "accommodation",
    "totalTaxes",
    "totalPrice",
    "hostChannelFee",
    "paymentFees",
    "totalPayout",
    "propertyManagerPayout",
  ];

  const interestedColumns = statement.financeDataJson.columns
    .map((column, index) => ({ ...column, index }))
    .filter((column) => {
      return !!tableColumns.find((tableColumn) => column.name === tableColumn);
    });

  const bookings = statement.financeDataJson.rows.map((row, i) => {
    const booking = {};

    interestedColumns.forEach((column) => {
      booking[column.name] = row[column.index];
    });

    return booking;
  });

  return bookings;
};

module.exports = StatementService;
