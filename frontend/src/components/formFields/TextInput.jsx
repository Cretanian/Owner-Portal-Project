import { forwardRef } from "react";
import styles from "./TextInput.module.css";

const TextInput = forwardRef(function TextInput(
  { label, error, className = "", inputClassName = "", ...inputProps },
  ref,
) {
  return (
    <label className={`${styles.field} ${className}`.trim()}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        ref={ref}
        className={`${styles.input} ${error ? styles.inputError : ""} ${inputClassName}`.trim()}
        {...inputProps}
      />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
});

export default TextInput;
