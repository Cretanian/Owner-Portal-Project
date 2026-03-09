import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./BaseButton.module.css";

function BaseButton({
  label,
  icon,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  loadingLabel,
  ...rest
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async (event) => {
    if (!onClick || disabled || isLoading) return;

    const result = onClick(event);

    if (result && typeof result.then === "function") {
      setIsLoading(true);
      try {
        await result;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${className}`.trim()}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...rest}
    >
      <span className={styles.content}>
        {isLoading ? (
          <CircularProgress size={16} thickness={5} className={styles.loader} />
        ) : (
          <span className={styles.icon}>{icon}</span>
        )}
        <span className={styles.label}>{isLoading ? loadingLabel ?? label : label}</span>
      </span>
    </button>
  );
}

export default BaseButton;
