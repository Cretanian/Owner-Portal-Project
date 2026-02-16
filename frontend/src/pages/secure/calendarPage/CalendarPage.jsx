import React, { useEffect, useMemo, useState } from "react";
import { Outlet } from "react-router";
import { getCalendarEventsPerUserId } from "../../../../api/calendar";
import Tabs from "../../../components/tabs/Tabs";
import { getListings } from "../../../../api/listings";

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

  if (!listings) return;

  if (listings.length === 0) return "No listings";

  return (
    <div>
      <Tabs tabs={tabs} />
      <Outlet context={{ listings }} />
    </div>
  );
}

export default CalendarPage;
