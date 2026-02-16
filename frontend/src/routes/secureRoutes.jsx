import AnalyticsPage from "../pages/secure/analyticsPage/AnalyticsPage";
import CalendarPage from "../pages/secure/calendarPage/CalendarPage";
import Calendar_MonthView from "../pages/secure/calendarPage/views/Calendar_MonthView";
import Calendar_MultiView from "../pages/secure/calendarPage/views/Calendar_MultiView";
import Calendar_YearView from "../pages/secure/calendarPage/views/Calendar_YearView";
import StatementsPage from "../pages/secure/statementsPage/StatementsPage";

import SecureRootLayout from "../layouts/secureRootLayout/SecureRootLayout";
import StatementPage from "../pages/secure/statementPage/StatementPage";
import UsersPage from "../pages/secure/usersPage/UsersPage";
import { Navigate } from "react-router";

const routes = [
  {
    path: "",
    Component: SecureRootLayout,
    children: [
      {
        path: "",
        Component: () => <Navigate to={"calendar"} replace />,
      },
      {
        path: "users",
        Component: UsersPage,
      },
      {
        path: "calendar",
        Component: CalendarPage,
        children: [
          {
            path: "",
            Component: () => <Navigate to={"multi-view"} replace />,
          },
          {
            path: "multi-view",
            Component: Calendar_MultiView,
          },
          {
            path: "year-view",
            Component: Calendar_YearView,
          },
          {
            path: "month-view",
            Component: Calendar_MonthView,
          },
          {
            path: "*",
            Component: () => <Navigate to={"multi-view"} replace />,
          },
        ],
      },
      {
        path: "analytics",
        Component: AnalyticsPage,
      },
      {
        path: "statements",
        Component: StatementsPage,
      },
      {
        path: "statements/:statementId",
        Component: StatementPage,
      },
      {
        path: "login",
        Component: () => <Navigate to={"/"} replace />,
      },
    ],
  },
];

export default routes;
