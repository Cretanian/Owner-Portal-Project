import React, { useEffect, useState } from "react";
import { getStatementById, getStatements } from "../../../../api/statements";
import { DataGrid } from "@mui/x-data-grid";
import { useParams } from "react-router";
import { useMemo } from "react";
function StatementPage() {
  const [statement, setStatement] = useState();
  const { statementId } = useParams();

  const tableColumns = [
    { field: "listingName", headerName: "Listing" },
    { field: "guestName", headerName: "Guest" },
    { field: "channelName", headerName: "Channel" },
    { field: "arrivalDate", headerName: "Check-in Date" },
    { field: "departureDate", headerName: "Check-out Date" },
    { field: "numberOfGuests", headerName: "Number of Guests" },
    { field: "nights", headerName: "Nights" },
    { field: "accommodation", headerName: "Accommodation" },
    { field: "totalTaxes", headerName: "Total Taxes" },
    { field: "totalPrice", headerName: "Total Price" },
    { field: "hostChannelFee", headerName: "Host Channel Fee" },
    { field: "paymentFees", headerName: "Payment Fees" },
    { field: "totalPayout", headerName: "Total Payout" },
    {
      field: "propertyManagerPayout",
      headerName: "Property Manager Payout",
    },
  ];

  const bookings = useMemo(() => {
    if (!statement) return;

    return statement.bookings.map((booking, i) => ({
      ...booking,
      id: i,
    }));
  }, [statement]);

  const fetchStatement = async () => {
    const statement = await getStatementById(statementId);

    setStatement(statement);
  };

  useEffect(() => {
    fetchStatement();
  }, []);

  if (!statement) return null;

  return (
    <DataGrid
      rows={bookings}
      columns={tableColumns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[10]}
    />
  );
}

export default StatementPage;
