import Select from "react-select";
import { createSelectStyles } from "./reactSelectStyles";
import styles from "./MultiSelectInput.module.css";

function MultiSelectInput({
  label,
  options = [],
  values = [],
  onChange,
  placeholder,
  error,
  isDisabled = false,
  menuPortalTarget = document.getElementById("root"),
  maxValueContainerHeight = "124px",
}) {
  const selectedOptions = options.filter((option) =>
    values.map(String).includes(String(option.value)),
  );

  return (
    <label className={styles.field}>
      {label && <span className={styles.label}>{label}</span>}
      <Select
        isMulti
        options={options}
        value={selectedOptions}
        onChange={(nextOptions) =>
          onChange?.((nextOptions ?? []).map((option) => option.value))
        }
        placeholder={placeholder}
        closeMenuOnSelect={false}
        isDisabled={isDisabled}
        styles={createSelectStyles({
          hasError: Boolean(error),
          maxValueContainerHeight,
        })}
        menuPortalTarget={menuPortalTarget}
      />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}

export default MultiSelectInput;
