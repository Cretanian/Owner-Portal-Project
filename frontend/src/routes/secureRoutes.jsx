import AnalyticsPage from "../pages/secure/analyticsPage/AnalyticsPage";
import CalendarPage from "../pages/secure/calendarPage/CalendarPage";
import StatementsPage from "../pages/secure/statementsPage/StatementsPage";

const routes = [
  {
    path: "",
    children: [
      {
        path: "calendar",
        Component: CalendarPage,
      },
      {
        path: "analytics",
        Component: AnalyticsPage,
      },
      {
        path: "statements",
        Component: StatementsPage,
      },
    ],
  },
];

export default routes;
