import React from "react";
import { Link } from "react-router";
import styles from "./Navbar.module.css";
import { useUser } from "../../context/userContextProvider/UserContextProvider";
import { logout } from "../../../api/auth";
import { setAuthHeaders } from "../../../api";

function Navbar({ links = [] }) {
  const { user, setUser } = useUser();

  const handleLogout = async () => {
    await logout();

    setAuthHeaders(null);
    setUser(null);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}> LOGO </div>

      <div className={styles.links}>
        {links.map((link) => (
          <Link key={link.to} to={link.to} className={styles.link}>
            {link.icon && <link.icon className={styles.icon} />}
            {link.title}
          </Link>
        ))}
      </div>

      {user && (
        <div className={styles.userArea}>
          <div className={styles.user}>
            {user.firstName} {user.lastName}
          </div>
          <button
            className={styles.logoutButton}
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
