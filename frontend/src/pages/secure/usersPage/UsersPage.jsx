import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getAllUsers,
  setPassword as setUserPassword,
} from "../../../../api/users";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "../../../components/modal/Modal";
import Heading from "../../../components/heading/Heading";
import LoaderContainer from "../../../components/loaderContainer/LoaderContainer";
import TextInput from "../../../components/formFields/TextInput";
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

  return (
    <>
      <Heading level={1}>Users</Heading>
      <LoaderContainer isLoading={!users} minHeight="32vh">
        <DataGrid
          rows={users?.map(transformUserForTable) ?? []}
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

const SetPasswordButton = ({ user }) => {
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const formId = `set-password-${user.id}`;

  const handleClose = () => {
    setModalIsVisible(false);
    reset();
    setSaveError("");
    setIsSaving(false);
  };

  const onSubmit = async ({ password }) => {
    setSaveError("");

    try {
      setIsSaving(true);
      await setUserPassword(user.id, password);
      handleClose();
    } catch {
      setIsSaving(false);
      setSaveError("Failed to set password.");
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
            <button
              className={styles.modalButton}
              type="submit"
              form={formId}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Set Password"}
            </button>
          }
        >
          <form
            className={styles.form}
            id={formId}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextInput
              label="Password"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 1,
                  message: "Password is required.",
                },
              })}
            />

            <TextInput
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm the password.",
                validate: (value, formValues) =>
                  value === formValues.password || "Passwords do not match.",
              })}
            />

            {saveError && <p className={styles.error}>{saveError}</p>}
          </form>
        </Modal>
      )}
    </>
  );
};

export default UsersPage;
