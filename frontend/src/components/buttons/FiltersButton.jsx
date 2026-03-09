import { FiSliders } from "react-icons/fi";
import BaseButton from "./BaseButton";

function FiltersButton({ label = "Filters", ...props }) {
  return (
    <BaseButton
      label={label}
      icon={<FiSliders size={16} />}
      variant="secondary"
      {...props}
    />
  );
}

export default FiltersButton;
