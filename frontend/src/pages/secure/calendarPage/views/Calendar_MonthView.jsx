import React, { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { useOutletContext } from "react-router";
import Modal from "../../../../components/modal/Modal";
import { getCalendarEventsPerListing } from "../../../../../api/calendar";
import "react-day-picker/style.css";
import styles from "../Calendar_MonthView.module.css";

function Calendar_MonthView() {
  const { listings } = useOutletContext();
  const [eventsPerListing, setEventsPerListing] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [selectedListingId, setSelectedListingId] = useState(
    listings[0]?.id ?? "",
  );
  const currentMonth = useMemo(() => startOfMonth(new Date()), []);
  const minMonth = useMemo(() => addMonths(currentMonth, -24), [currentMonth]);
  const maxMonth = useMemo(() => addMonths(currentMonth, 24), [currentMonth]);
  const [selectedMonthDate, setSelectedMonthDate] = useState(currentMonth);
  const monthDate = selectedMonthDate;
  const monthInputValue = format(selectedMonthDate, "yyyy-MM");

  const clampMonth = (month) => {
    if (isBefore(month, minMonth)) return minMonth;
    if (isAfter(month, maxMonth)) return maxMonth;
    return month;
  };

  const handleMonthInputChange = (value) => {
    if (!value) return;
    const parsedMonth = new Date(`${value}-01T00:00:00`);
    if (Number.isNaN(parsedMonth.getTime())) return;
    setSelectedMonthDate(clampMonth(startOfMonth(parsedMonth)));
  };

  const handleMonthShift = (offset) => {
    setSelectedMonthDate((current) => clampMonth(addMonths(current, offset)));
  };

  const isPreviousDisabled = useMemo(
    () => !isAfter(selectedMonthDate, minMonth),
    [selectedMonthDate, minMonth],
  );
  const isNextDisabled = useMemo(
    () => !isBefore(selectedMonthDate, maxMonth),
    [selectedMonthDate, maxMonth],
  );

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

        const displayStart = startOfWeek(startOfMonth(monthDate), {
          weekStartsOn: 1,
        });
        const displayEnd = endOfWeek(endOfMonth(monthDate), {
          weekStartsOn: 1,
        });

        const events = await getCalendarEventsPerListing(selectedListingId, {
          startDate: format(displayStart, "yyyy-MM-dd"),
          endDate: format(addDays(displayEnd, 1), "yyyy-MM-dd"),
        });

        if (!isActive) return;
        setEventsPerListing(Array.isArray(events) ? events : []);
      } catch {
        if (!isActive) return;
        setLoadError("Failed to load month events");
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
  }, [monthDate, selectedListingId]);

  const dayEvents = useMemo(() => {
    const eventPriority = {
      available: 1,
      blocked: 2,
      reserved: 3,
    };
    const byDate = new Map();

    eventsPerListing.forEach((event) => {
      if (!event?.type || eventPriority[event.type] === undefined) return;

      const from = parseISO(event.start);
      const to = subDays(parseISO(event.end), 1);

      if (
        Number.isNaN(from.getTime()) ||
        Number.isNaN(to.getTime()) ||
        to < from
      ) {
        return;
      }

      for (let day = from; day <= to; day = addDays(day, 1)) {
        const dateKey = format(day, "yyyy-MM-dd");
        const existing = byDate.get(dateKey);
        const existingPriority = existing ? eventPriority[existing.type] : 0;
        const currentPriority = eventPriority[event.type];

        if (currentPriority >= existingPriority) {
          byDate.set(dateKey, event);
        }
      }
    });

    return byDate;
  }, [eventsPerListing]);

  const reservedRanges = useMemo(() => {
    return eventsPerListing
      .filter((event) => event.type === "reserved")
      .map((event) => ({
        from: parseISO(event.start),
        to: subDays(parseISO(event.end), 1),
      }))
      .filter(
        (range) =>
          !Number.isNaN(range.from.getTime()) &&
          !Number.isNaN(range.to.getTime()) &&
          range.to >= range.from,
      );
  }, [eventsPerListing]);

  const modifiers = useMemo(() => {
    const toMiddleMatchers = (ranges) =>
      ranges
        .filter((range) => range.to > range.from)
        .map((range) => ({ after: range.from, before: range.to }));

    const getDayType = (date) =>
      dayEvents.get(format(date, "yyyy-MM-dd"))?.type;

    return {
      available: (date) => getDayType(date) === "available",
      blocked: (date) => getDayType(date) === "blocked",
      reserved: reservedRanges,
      reservedStart: reservedRanges.map((range) => range.from),
      reservedEnd: reservedRanges.map((range) => range.to),
      reservedMiddle: toMiddleMatchers(reservedRanges),
    };
  }, [dayEvents, reservedRanges]);

  const modifiersClassNames = useMemo(
    () => ({
      available: "available",
      blocked: "blocked",
      reserved: "reserved",
      reservedStart: "reservedStart",
      reservedEnd: "reservedEnd",
      reservedMiddle: "reservedMiddle",
    }),
    [],
  );

  const handleDayClick = (date) => {
    const event = dayEvents.get(format(date, "yyyy-MM-dd"));

    if (event?.type === "reserved" && event.reservation) {
      setModalData({ reservation: event.reservation });
    }
  };

  const DayButton = ({ day, ...buttonProps }) => {
    const event = dayEvents.get(day.isoDate);
    const isReserved = event?.type === "reserved";

    return (
      <button
        {...buttonProps}
        title={isReserved ? "Open reservation details" : undefined}
      >
        <div className={styles.dayCellContent}>
          <div className={styles.dayNumber}>{day.date.getDate()}</div>

          {event?.type === "available" && (
            <>
              <div className={styles.availablePrice}>{event.price}€</div>
              <div className={styles.metaText}>
                {event.minimumStay} nights min
              </div>
            </>
          )}

          {event?.type === "blocked" && (
            <div className={styles.blockedText}>Locked</div>
          )}

          {event?.type === "reserved" && (
            <>
              <div className={styles.reservedText}>
                {event.reservation?.guestName}
              </div>
              <div className={styles.metaText}>
                {event.reservation?.totalPrice}€
              </div>
            </>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className={styles.monthView}>
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
          Month
          <div className={styles.monthControls}>
            <button
              type="button"
              className={styles.monthNavButton}
              onClick={() => handleMonthShift(-1)}
              disabled={isPreviousDisabled}
            >
              Previous
            </button>
            <input
              type="month"
              value={monthInputValue}
              min={format(minMonth, "yyyy-MM")}
              max={format(maxMonth, "yyyy-MM")}
              onChange={(e) => handleMonthInputChange(e.target.value)}
            />
            <button
              type="button"
              className={styles.monthNavButton}
              onClick={() => handleMonthShift(1)}
              disabled={isNextDisabled}
            >
              Next
            </button>
          </div>
        </label>
      </div>

      {isLoading && (
        <div className={styles.info}>Loading calendar events...</div>
      )}
      {loadError && <div className={styles.error}>{loadError}</div>}

      {!isLoading && !loadError && (
        <div className={styles.calendarFrame}>
          <DayPicker
            className={styles.monthPicker}
            month={monthDate}
            hideNavigation
            showOutsideDays
            fixedWeeks
            weekStartsOn={1}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            onDayClick={handleDayClick}
            components={{ DayButton }}
          />
        </div>
      )}

      {modalData && (
        <ReservationModal {...modalData} onClose={() => setModalData(null)} />
      )}
    </div>
  );
}

const ReservationModal = ({ reservation, onClose }) => {
  return (
    <Modal onClose={onClose} title={"Reservation info"}>
      <div>Guest Name: {reservation.guestName}</div>
      <div>
        Dates: {reservation.arrivalDate} - {reservation.departureDate}
      </div>
      <div>Nights: {reservation.nights}</div>
      <div>Number of guests: {reservation.numberOfGuests}</div>
      <div>Total price: {reservation.totalPrice}</div>
    </Modal>
  );
};

export default Calendar_MonthView;
