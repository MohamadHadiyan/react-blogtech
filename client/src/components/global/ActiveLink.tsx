import React, { AnchorHTMLAttributes } from "react";
import { Link } from "react-router-dom";

export type LinkColorType = "purple" | "link" | "secondary" | "light" | "dark";
export type TargetType = "_blank" | "_parent" | "_self" | "_top";
export type LinkLocation = {
  pathname: string;
};

interface ILink {
  to?: string | LinkLocation;
  stretched?: boolean;
  color?: LinkColorType;
}

const ActiveLink = ({
  to = "#",
  children,
  className = "",
  stretched,
  color,
  ...prop
}: AnchorHTMLAttributes<HTMLAnchorElement> & ILink) => {
  return (
    <Link
      to={to}
      className={`text-decoration-none fw-semi-bold ${
        stretched ? "stretched-link" : ""
      }${color ? " text-" + color : ""} ${className}`}
      {...prop}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
