import React from "react";
import { Link } from "react-router";
import styles from "./Navbar.module.css";

function Navbar({ links = [] }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}> LOGO </div>

      <div className={styles.links}>
        {links.map((link) => (
          <Link to={link.to} className={styles.link}>
            {link.icon && <link.icon className={styles.icon} />}
            {link.title}
          </Link>
        ))}
      </div>

      <div className={styles.user}>User</div>
    </nav>
  );
}

export default Navbar;
