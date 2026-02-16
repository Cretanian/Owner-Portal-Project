import React from "react";
import Heading from "../../../components/heading/Heading";
import LoaderContainer from "../../../components/loaderContainer/LoaderContainer";

function UsersPage() {
  return (
    <LoaderContainer isLoading={false}>
      <Heading level={1}>Users</Heading>
    </LoaderContainer>
  );
}

export default UsersPage;
