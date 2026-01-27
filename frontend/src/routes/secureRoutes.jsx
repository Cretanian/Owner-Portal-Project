import AnalyticsPage from "../pages/secure/analyticsPage/AnalyticsPage";
import CalendarPage from "../pages/secure/calendarPage/CalendarPage";
import StatementsPage from "../pages/secure/statementsPage/StatementsPage";

import SecureRootLayout from "../layouts/secureRootLayout/SecureRootLayout";
import StatementPage from "../pages/secure/statementPage/StatementPage";
import UsersPage from "../pages/secure/usersPage/UsersPage";

const routes = [
  {
    path: "",
    Component: SecureRootLayout,
    children: [
      {
        path: "users",
        Component: UsersPage,
      },
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
      {
        path: "statements/:statementId",
        Component: StatementPage,
      },
    ],
  },
];

export default routes;
