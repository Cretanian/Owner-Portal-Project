import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  setPassword as setUserPassword,
} from "../../../../api/users";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "../../../components/modal/Modal";
import styles from "./UsersPage.module.css";

function UsersPage() {
  const [users, setUsers] = useState();

  const tableColumns = [
    { field: "email", headerName: "Email" },
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "lastLoginOn", headerName: "Last Login" },
    {
      field: "actions",
      headerName: "actions",
      renderCell: (params) => <SetPasswordButton user={params.row} />,
    },
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
    <>
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
    </>
  );
}

const SetPasswordButton = ({ user }) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formId = `set-password-${user.id}`;

  const handleClose = () => {
    setModalIsVisible(false);
    setPassword("");
    setConfirmPassword("");
    setError("");
    setIsSaving(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Both password fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSaving(true);
      await setUserPassword(user.id, password);
      handleClose();
    } catch (err) {
      setIsSaving(false);
      setError("Failed to set password.");
    }
  };

  return (
    <>
      <button onClick={() => setModalIsVisible(true)}>Set Password</button>

      {modalIsVisible && (
        <Modal
          onClose={handleClose}
          title={`Set password for ${user.email}`}
          footer={
            <button type="submit" form={formId} disabled={isSaving}>
              {isSaving ? "Saving..." : "Set Password"}
            </button>
          }
        >
          <form className={styles.form} id={formId} onSubmit={handleSubmit}>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            {error && <p>{error}</p>}
          </form>
        </Modal>
      )}
    </>
  );
};

export default UsersPage;
