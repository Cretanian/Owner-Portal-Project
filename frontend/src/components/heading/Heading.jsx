import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router";
import styles from "./Heading.module.css";

function Heading({
  level = 1,
  className = "",
  children,
  showBackButton,
  backLabel = "Go back",
  backTo,
  onBack,
  ...rest
}) {
  const navigate = useNavigate();
  const normalizedLevel =
    Number.isInteger(level) && level >= 1 && level <= 6 ? level : 1;
  const Tag = `h${normalizedLevel}`;
  const shouldShowBackButton =
    typeof showBackButton === "boolean"
      ? showBackButton
      : normalizedLevel === 1;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (backTo) {
      navigate(backTo);
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/", { replace: true });
  };

  if (shouldShowBackButton) {
    return (
      <div
        className={[styles.headingRow, styles[`rowH${normalizedLevel}`]]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          aria-label={backLabel}
          title={backLabel}
        >
          <FiChevronLeft size={16} />
        </button>
        <Tag
          className={[styles.heading, styles[`h${normalizedLevel}`], className]
            .filter(Boolean)
            .join(" ")}
          {...rest}
        >
          {children}
        </Tag>
      </div>
    );
  }

  return (
    <Tag
      className={[styles.heading, styles[`h${normalizedLevel}`], className]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Heading;
