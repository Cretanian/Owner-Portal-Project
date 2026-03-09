const focusRing = "0 0 0 3px rgba(16, 24, 40, 0.15)";

export const createSelectStyles = ({
  hasError = false,
  maxValueContainerHeight,
} = {}) => ({
  control: (base, state) => ({
    ...base,
    minHeight: 44,
    borderRadius: 10,
    borderColor: hasError ? "#f04438" : state.isFocused ? "#1d2939" : "#d0d5dd",
    boxShadow: state.isFocused ? focusRing : "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    ":hover": {
      borderColor: hasError ? "#f04438" : "#98a2b3",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "4px 12px",
    maxHeight: maxValueContainerHeight ?? "none",
    overflowY: maxValueContainerHeight ? "auto" : "visible",
    alignContent: "flex-start",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#667085",
  }),
  input: (base) => ({
    ...base,
    color: "#101828",
  }),
  singleValue: (base) => ({
    ...base,
    color: "#101828",
    fontWeight: 500,
  }),
  multiValue: (base) => ({
    ...base,
    borderRadius: 999,
    backgroundColor: "#f2f4f7",
    border: "1px solid #eaecf0",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#344054",
    fontWeight: 600,
    padding: "2px 8px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    color: "#667085",
    ":hover": {
      color: "#101828",
      backgroundColor: "#e4e7ec",
    },
    flexGrow: 0,
    flexShrink: 0,
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 10,
    border: "1px solid #eaecf0",
    boxShadow: "0 12px 28px rgba(16, 24, 40, 0.14)",
    overflow: "hidden",
    zIndex: 2000,
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 2000,
  }),
  menuList: (base) => ({
    ...base,
    padding: 6,
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: 8,
    fontWeight: state.isSelected ? 700 : 500,
    backgroundColor: state.isSelected
      ? "#eef4ff"
      : state.isFocused
        ? "#f9fafb"
        : "#ffffff",
    color: "#101828",
    cursor: "pointer",
  }),
  noOptionsMessage: (base) => ({
    ...base,
    color: "#667085",
  }),
});
