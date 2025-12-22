import React from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineAnalytics, MdOutlinePayments } from "react-icons/md";
import Navbar from "../../components/navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../../components/footer/Footer";

import styles from "./SecureRootLayout.module.css";

function SecureRootLayout() {
  const links = [
    {
      to: "calendar",
      icon: FaRegCalendarAlt,
      title: "Calendar",
    },
    {
      to: "analytics",
      icon: MdOutlineAnalytics,
      title: "Analytics",
    },
    {
      to: "statements",
      icon: MdOutlinePayments,
      title: "Statements",
    },
  ];

  return (
    <div className={styles.page}>
      <Navbar links={links} />
      <div className={styles.content}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default SecureRootLayout;
