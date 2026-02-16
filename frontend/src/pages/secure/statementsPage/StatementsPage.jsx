import React, { useEffect, useState } from "react";
import { getStatements } from "../../../../api/statements";
import { DataGrid } from "@mui/x-data-grid";
import {
  formatDayMonth,
  formatMonthRange,
  getYear,
} from "../../../utils/Utils";
import { Link } from "react-router";
import Heading from "../../../components/heading/Heading";
import LoaderContainer from "../../../components/loaderContainer/LoaderContainer";

function StatementsPage() {
  const [statements, setStatements] = useState();

  const tableColumns = [
    {
      field: "statementName",
      headerName: "Statement",
      renderCell: (params) => (
        <Link to={String(params.row.id)}>{params.value}</Link>
      ),
    },
    { field: "date", headerName: "Date" },
    { field: "createdOn", headerName: "Created On" },
    { field: "totalPayout", headerName: "Total Payout" },
    { field: "propertyManagerPayout", headerName: "Property Manager Payout" },
    { field: "year", headerName: "Year" },
  ];

  const transformStatementForTable = (statement) => ({
    ...statement,
    year: getYear(statement.dateFrom),
    date: formatMonthRange(statement.dateTo),
    createdOn: formatDayMonth(statement.insertedOn),
    totalPayout: statement.summaryDataJson?.find(
      (summary) => summary.formulaName === "ownerPayout"
    )?.totalValue,
    propertyManagerPayout: statement.summaryDataJson?.find(
      (summary) => summary.formulaName === "propertyManagerPayout"
    )?.totalValue,
  });

  const fetchStatements = async () => {
    const statements = await getStatements();

    setStatements(statements);
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  return (
    <>
      <Heading level={1}>Statements</Heading>
      <LoaderContainer isLoading={!statements} minHeight="32vh">
        <DataGrid
          rows={statements?.map(transformStatementForTable) ?? []}
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
      </LoaderContainer>
    </>
  );
}

export default StatementsPage;
