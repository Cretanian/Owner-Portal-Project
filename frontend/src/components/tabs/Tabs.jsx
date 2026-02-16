import React from "react";
import { NavLink } from "react-router";
import styles from "./Tabs.module.css";

function Tabs({ tabs }) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `${styles.tab} ${isActive ? styles.tabActive : ""}`.trim()
          }
          end={tab.end}
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}

export default Tabs;
