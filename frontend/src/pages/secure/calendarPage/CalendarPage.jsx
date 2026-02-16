import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import Tabs from "../../../components/tabs/Tabs";
import { getListings } from "../../../../api/listings";
import Heading from "../../../components/heading/Heading";
import LoaderContainer from "../../../components/loaderContainer/LoaderContainer";

function CalendarPage() {
  const [listings, setListings] = useState();

  const tabs = useMemo(
    () => [
      { label: "Multi View", to: "multi-view" },
      { label: "Year View", to: "year-view" },
      { label: "Month View", to: "month-view" },
    ],
    [],
  );

  const fetchListings = async () => {
    const listings = await getListings();

    setListings(listings);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <Heading level={1}>Calendar</Heading>
      <LoaderContainer isLoading={!listings} minHeight="40vh">
        {listings?.length === 0 ? (
          "No listings"
        ) : (
          <>
            <Tabs tabs={tabs} />
            <Outlet context={{ listings }} />
          </>
        )}
      </LoaderContainer>
    </>
  );
}

export default CalendarPage;
