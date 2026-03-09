import Select from "react-select";
import { createSelectStyles } from "./reactSelectStyles";
import styles from "./SelectInput.module.css";

function SelectInput({
  label,
  options = [],
  value,
  onChange,
  placeholder,
  error,
  isClearable = false,
  isDisabled = false,
  menuPortalTarget,
}) {
  const selectedOption =
    options.find((option) => String(option.value) === String(value)) ?? null;

  return (
    <label className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <Select
        options={options}
        value={selectedOption}
        onChange={(option) => onChange?.(option ? option.value : null)}
        placeholder={placeholder}
        isClearable={isClearable}
        isDisabled={isDisabled}
        styles={createSelectStyles({ hasError: Boolean(error) })}
        menuPortalTarget={menuPortalTarget}
      />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

export default SelectInput;
