import React from "react";
import { FiMail, FiPhone } from "react-icons/fi";

import styles from "./Footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <img
            src="/logo_with_text.svg"
            alt="Cretan Hospitality Services"
            className={styles.logo}
          />
          <p className={styles.tagline}>Property Management Company</p>
        </div>

        <div className={styles.meta}>
          <a href="tel:+306945710663" className={styles.link}>
            <FiPhone size={14} />
            <span>+30 694 571 0663</span>
          </a>
          <a href="mailto:cretanhs@gmail.com" className={styles.link}>
            <FiMail size={14} />
            <span>cretanhs@gmail.com</span>
          </a>
          <span className={styles.copy}>
            © {currentYear} Cretan Hospitality Services
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
