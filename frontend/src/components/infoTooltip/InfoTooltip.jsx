import Tooltip from "@mui/material/Tooltip";
import { FiInfo } from "react-icons/fi";
import styles from "./InfoTooltip.module.css";

function InfoTooltip({ content, placement = "top" }) {
  return (
    <Tooltip
      title={content}
      placement={placement}
      arrow
      slotProps={{
        tooltip: {
          className: styles.tooltip,
        },
        arrow: {
          className: styles.arrow,
        },
      }}
    >
      <button
        type="button"
        className={styles.iconButton}
        aria-label="More information"
      >
        <FiInfo size={14} />
      </button>
    </Tooltip>
  );
}

export default InfoTooltip;
