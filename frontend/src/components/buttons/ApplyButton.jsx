import { FiCheck } from "react-icons/fi";
import BaseButton from "./BaseButton";

function ApplyButton({ label = "Apply", ...props }) {
  return (
    <BaseButton
      label={label}
      icon={<FiCheck size={16} />}
      variant="primary"
      {...props}
    />
  );
}

export default ApplyButton;
