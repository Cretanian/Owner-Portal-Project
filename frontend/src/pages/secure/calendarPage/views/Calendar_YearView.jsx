import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { parseISO, subDays } from "date-fns";
import { useOutletContext } from "react-router";
import { getCalendarEventsPerListing } from "../../../../../api/calendar";
import "react-day-picker/style.css";
import styles from "../Calendar_YearView.module.css";

function Calendar_YearView() {
  const { listings } = useOutletContext();
  const [eventsPerListing, setEventsPerListing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState(
    listings[0]?.id ?? "",
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!selectedListingId) {
      setEventsPerListing([]);
      return;
    }

    let isActive = true;

    const fetchCalendarEventsPerListing = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const events = await getCalendarEventsPerListing(selectedListingId, {
          startDate: `${selectedYear}-01-01`,
          endDate: `${selectedYear + 1}-01-01`,
        });

        if (!isActive) return;
        setEventsPerListing(Array.isArray(events) ? events : []);
      } catch {
        if (!isActive) return;
        setLoadError("Failed to load year events");
        setEventsPerListing([]);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchCalendarEventsPerListing();

    return () => {
      isActive = false;
    };
  }, [selectedListingId, selectedYear]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return [
      currentYear - 2,
      currentYear - 1,
      currentYear,
      currentYear + 1,
      currentYear + 2,
    ];
  }, []);

  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIndex) => ({
      key: `${selectedYear}-${String(monthIndex + 1).padStart(2, "0")}`,
      date: new Date(selectedYear, monthIndex, 1),
      label: new Date(selectedYear, monthIndex, 1).toLocaleString("en-US", {
        month: "long",
      }),
    }));
  }, [selectedYear]);

  const eventRanges = useMemo(() => {
    const reservedRanges = [];
    const blockedRanges = [];

    eventsPerListing.forEach((event) => {
      if (event.type !== "reserved" && event.type !== "blocked") return;

      const from = parseISO(event.start);
      const to = subDays(parseISO(event.end), 1);

      if (
        Number.isNaN(from.getTime()) ||
        Number.isNaN(to.getTime()) ||
        to < from
      ) {
        return;
      }

      if (event.type === "reserved") {
        reservedRanges.push({ from, to });
      } else {
        blockedRanges.push({ from, to });
      }
    });

    return { reservedRanges, blockedRanges };
  }, [eventsPerListing]);

  const modifiers = useMemo(() => {
    const toMiddleMatchers = (ranges) =>
      ranges
        .filter((range) => range.to > range.from)
        .map((range) => ({ after: range.from, before: range.to }));

    return {
      reserved: eventRanges.reservedRanges,
      blocked: eventRanges.blockedRanges,
      reservedStart: eventRanges.reservedRanges.map((range) => range.from),
      reservedEnd: eventRanges.reservedRanges.map((range) => range.to),
      reservedMiddle: toMiddleMatchers(eventRanges.reservedRanges),
      blockedStart: eventRanges.blockedRanges.map((range) => range.from),
      blockedEnd: eventRanges.blockedRanges.map((range) => range.to),
      blockedMiddle: toMiddleMatchers(eventRanges.blockedRanges),
    };
  }, [eventRanges]);

  const modifiersClassNames = useMemo(
    () => ({
      reserved: "reserved",
      blocked: "blocked",
      reservedStart: "reservedStart",
      reservedEnd: "reservedEnd",
      reservedMiddle: "reservedMiddle",
      blockedStart: "blockedStart",
      blockedEnd: "blockedEnd",
      blockedMiddle: "blockedMiddle",
    }),
    [],
  );

  return (
    <div className={styles.yearView}>
      <div className={styles.controls}>
        <label>
          Listing
          <select
            value={selectedListingId}
            onChange={(e) => setSelectedListingId(e.target.value)}
          >
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && (
        <div className={styles.info}>Loading calendar events...</div>
      )}
      {loadError && <div className={styles.error}>{loadError}</div>}

      {!isLoading && !loadError && (
        <div className={styles.monthsGrid}>
          {months.map((month) => (
            <div key={month.key}>
              <div className={styles.monthTitle}>{month.label}</div>
              <DayPicker
                className={styles.monthPicker}
                month={month.date}
                hideNavigation
                showOutsideDays={false}
                fixedWeeks
                weekStartsOn={1}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Calendar_YearView;
