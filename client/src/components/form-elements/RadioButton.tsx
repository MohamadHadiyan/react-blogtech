import React from "react";
import getUniqueID from "../../utils/GetUniqueID";
import { InputChange } from "../../utils/TypeScript";

interface IProps {
  defaultChecked: boolean;
  onChange?: (checke: boolean) => void;
  firstLabel?: boolean;
  boxClass?: string;
  label?: string;
  labelClass?: string;
  className?: string;
  name: string;
  wrap?: boolean;
}
const RadioButton = ({
  defaultChecked,
  onChange,
  firstLabel,
  className="",
  boxClass="",
  labelClass="",
  label,
  name,
  wrap,
}: IProps) => {
  const htmlFor = getUniqueID();
  const handleChange = (e: InputChange) => {
    const target = e.target as HTMLInputElement;
    if (onChange) onChange(target.checked);
  };

  return (
    <div className={boxClass}>
      {label && firstLabel && (
        <label
          htmlFor={htmlFor}
          className={`me-2 cursor-pointer ${labelClass}`}
        >
          {label}
        </label>
      )}

      <input
        type="radio"
        name={name}
        id={htmlFor}
        checked={defaultChecked}
        className={`form-check-input ${className}`}
        onChange={handleChange}
      />

      {label && !firstLabel && (
        <label
          htmlFor={htmlFor}
          className={`ms-2 cursor-pointer ${labelClass}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default RadioButton;
