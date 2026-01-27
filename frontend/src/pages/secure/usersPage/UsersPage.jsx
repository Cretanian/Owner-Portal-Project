import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../../api/users";
import { DataGrid } from "@mui/x-data-grid";

function UsersPage() {
  const [users, setUsers] = useState();

  const tableColumns = [
    { field: "email", headerName: "Email" },
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "lastLoginOn", headerName: "Last Login" },
  ];

  const transformUserForTable = (user) => ({
    ...user,
  });

  const fetchUsers = async () => {
    const users = await getAllUsers();

    setUsers(users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!users) return null;

  return (
    <DataGrid
      rows={users.map(transformUserForTable)}
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

export default UsersPage;
