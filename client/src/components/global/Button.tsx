import React, { ButtonHTMLAttributes } from "react";
import { TColor } from "../../utils/TypeScript";

type TSize = "sm" | "" | "lg";

interface IButton {
  outline?: boolean;
  color?: TColor;
  size?: TSize;
  circle?: boolean;
  block?: boolean;
  border?: boolean;
  children?: React.ReactNode;
}

export type ButtonType = IButton & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  size,
  circle,
  outline,
  color,
  block,
  border,
  className = "",
  type = "button",
  ...props
}: ButtonType) => {
  return (
    <button
      type={type}
      className={`btn${size ? " btn-" + size : ""}${
        outline ? ` btn-outline-${color ? color : "secondary"}` : ""
      }${color && !outline ? " btn-" + color + " " : ""}${
        circle ? " rounded-circle" : ""
      }${block ? " w-100" : ""}${
        border ? " border" : ""
      } fw-semi-bold ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
