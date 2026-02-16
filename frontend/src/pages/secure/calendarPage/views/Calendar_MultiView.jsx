import React, { useEffect, useMemo, useState } from "react";
import { DayPilot, DayPilotScheduler } from "@daypilot/daypilot-lite-react";
import { renderToStaticMarkup } from "react-dom/server";
import { useOutletContext } from "react-router";
import Modal from "../../../../components/modal/Modal";
import styles from "../CalendarPage.module.css";
import { getCalendarEventsPerUserId } from "../../../../../api/calendar";

const greekLocale = new DayPilot.Locale("el-gr", {
  dayNames: [
    "Κυριακή",
    "Δευτέρα",
    "Τρίτη",
    "Τετάρτη",
    "Πέμπτη",
    "Παρασκευή",
    "Σάββατο",
  ],
  dayNamesShort: ["Κυρ", "Δευ", "Τρι", "Τετ", "Πεμ", "Παρ", "Σαβ"],
  monthNames: [
    "Ιανουάριος",
    "Φεβρουάριος",
    "Μάρτιος",
    "Απρίλιος",
    "Μάιος",
    "Ιούνιος",
    "Ιούλιος",
    "Αύγουστος",
    "Σεπτέμβριος",
    "Οκτώβριος",
    "Νοέμβριος",
    "Δεκέμβριος",
  ],
  monthNamesShort: [
    "Ιαν",
    "Φεβ",
    "Μαρ",
    "Απρ",
    "Μαι",
    "Ιουν",
    "Ιουλ",
    "Αυγ",
    "Σεπ",
    "Οκτ",
    "Νοε",
    "Δεκ",
  ],
  timePattern: "H:mm",
  datePattern: "dd/MM/yyyy",
  dateTimePattern: "dd/MM/yyyy H:mm",
  timeFormat: "Clock24Hours",
  weekStarts: 1,
});

DayPilot.Locale.register(greekLocale);

function Calendar_MultiView() {
  const [modalData, setModalData] = useState(false);
  const [listings, setListings] = useState();

  const fetchListingCalendarEvents = async () => {
    const listings = await getCalendarEventsPerUserId();

    setListings(listings);
  };

  useEffect(() => {
    fetchListingCalendarEvents();
  }, []);

  const config = {
    locale: "el-gr",
    timeHeaders: [{ groupBy: "Month" }, { groupBy: "Day", format: "ddd d" }],
    scale: "Day",
    days: DayPilot.Date.today().daysInYear(),
    startDate: DayPilot.Date.today().firstDayOfYear(),
    rowHeaderWidth: "300",
    cellWidth: "100",
    timeRangeSelectedHandling: "Disabled",
    eventMoveHandling: "Disabled",
    eventResizeHandling: "Disabled",
    eventDeleteHandling: "Disabled",
    onBeforeEventRender: (args) => {
      args.data.cssClass = `event-${args.data.type ?? "default"}`;
      args.data.html = renderToStaticMarkup(<Event event={args.data} />);
    },
    onEventClick: async (args) => {
      if (args.e.data.type === "reserved") {
        setModalData({ reservation: args.e.data.reservation });
      }
    },
  };

  const events = useMemo(() => {
    if (!listings) return null;

    return listings.flatMap((listing, i) =>
      listing.calendarEvents.map((event, j) => ({
        ...event,
        id: `${i}_${j}`,
        start: `${event.start}T00:00:00`,
        end: `${event.end}T00:00:00`,
        resource: listing.id,
      })),
    );
  }, [listings]);

  const resources = useMemo(() => {
    if (!listings) return null;

    return listings.map((listing) => ({
      name: `${listing.name} - ${listing.id}`,
      id: listing.id,
    }));
  }, [listings]);

  if (!listings) return;

  return (
    <div className={styles.calendarRoot}>
      <DayPilotScheduler {...config} events={events} resources={resources} />
      {modalData && (
        <ReservationModal {...modalData} onClose={() => setModalData(null)} />
      )}
    </div>
  );
}

const Event = ({ event }) => {
  if (event.type === "blocked") return <div className={styles.blocked}></div>;

  if (event.type === "available") {
    return (
      <div className={styles.available}>
        <div>{event.price}€</div>
        <div>{event.minimumStay} nights min</div>
      </div>
    );
  }

  if (event.type === "reserved") {
    return (
      <div className={styles.reserved}>
        <div>{event.reservation.guestName}</div>
        <div>{event.reservation.totalPrice}€</div>
      </div>
    );
  }

  return null;
};

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

export default Calendar_MultiView;
