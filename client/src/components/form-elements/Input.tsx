import React, { InputHTMLAttributes } from "react";

type TSize = "sm" | "" | "lg";

interface IInput {
  sizing?: TSize;
  multiLine?: boolean;
}

const Input = ({
  className = "",
  type = "text",
  sizing,
  ...props
}: IInput & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`form-control${type === "color" ? "-color" : ""} ${
        sizing ? "form-control-" + sizing : ""
      } ${className}`}
      type={type}
      {...props}
    />
  );
};

export default Input;
