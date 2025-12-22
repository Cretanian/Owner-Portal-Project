import { Outlet } from "react-router";
import Navbar from "../components/navbar/Navbar";
import AnalyticsPage from "../pages/secure/analyticsPage/AnalyticsPage";
import CalendarPage from "../pages/secure/calendarPage/CalendarPage";
import StatementsPage from "../pages/secure/statementsPage/StatementsPage";

import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { MdOutlinePayments } from "react-icons/md";
import Footer from "../components/footer/Footer";
import SecureRootLayout from "../layouts/secureRootLayout/SecureRootLayout";

const routes = [
  {
    path: "",
    Component: SecureRootLayout,
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
