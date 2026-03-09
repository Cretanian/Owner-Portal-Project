import { cloneElement, isValidElement, useState } from "react";
import MuiPopover from "@mui/material/Popover";
import styles from "./Popover.module.css";

function Popover({
  trigger,
  triggerLabel,
  title,
  children,
  triggerClassName = "",
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const isOpen = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const content =
    typeof children === "function"
      ? children({ close: handleClose })
      : children;

  const triggerNode =
    trigger && isValidElement(trigger)
      ? cloneElement(trigger, {
          onClick: (event) => {
            trigger.props.onClick?.(event);
            handleOpen(event);
          },
        })
      : null;

  return (
    <>
      {triggerNode ?? (
        <button
          type="button"
          className={`${styles.trigger} ${triggerClassName}`.trim()}
          onClick={handleOpen}
        >
          {triggerLabel}
        </button>
      )}

      <MuiPopover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          paper: {
            className: styles.paper,
          },
        }}
      >
        <div className={styles.content}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {content}
        </div>
      </MuiPopover>
    </>
  );
}

export default Popover;
