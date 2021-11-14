import React, { HTMLAttributes, RefObject, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMedia } from "../../hooks/useMedia";
import getUniqueID from "../../utils/GetUniqueID";

type TShadow = "shadow-sm" | "shadow" | "shadow-lg";
type TSize = "expand-sm" | "expand-md" | "expand-lg";
type Tcolor = "light" | "primary" | "dark" | "white";

interface IProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

interface IDiv {
  style?: HTMLAttributes<HTMLDivElement>["style"];
  setRef?: RefObject<HTMLDivElement>;
}

interface INavbar extends IProps, IDiv {
  color?: Tcolor;
  shadow?: TShadow;
  size?: TSize;
}
export const Navbar = ({
  color = "white",
  className = "",
  children,
  setRef,
  style,
  shadow = "shadow-sm",
  size = "expand-lg",
}: INavbar) => {
  const clases = `navbar navbar-expand-${size} navbar-${color} bg-${color} ${shadow} p-2 ${className}`;
  return (
    <div className={clases} ref={setRef} style={style}>
      {children}
    </div>
  );
};

export const NavbarHeader = ({ children }: IProps) => (
  <span className="navbar-header">{children}</span>
);

export const NavbarText = ({ children }: IProps) => (
  <span className="navbar-text">{children}</span>
);

interface IBrand extends IProps {
  url: string;
}
export const NavbarBrand = ({ url, children }: IBrand) => (
  <Link to={url} className="navbar-brand">
    {children}
  </Link>
);

interface IToggle {
  targetId: string;
  isActive: boolean;
  show?: boolean;
}

interface IToggler extends IToggle {
  handler: () => void;
}
export const NavbarToggler = ({
  handler,
  targetId,
  isActive,
  show,
}: IToggler) => (
  <button
    type="button"
    className={`navbar-toggler shadow-none btn-purple px-2 ${
      show ? "d-none" : ""
    }`}
    data-bs-toggle="collapse"
    onClick={handler}
    data-bs-target={targetId}
    aria-controls={targetId}
    aria-expanded={isActive}
    aria-label="Toggle navigation"
  >
    <i className="fas fa-bars" />
  </button>
);

export const NavbarCollapse = ({
  children,
  targetId,
  style,
  isActive,
}: IProps & IDiv & IToggle) => (
  <div
    className={`navbar-collapse collapse mt-3 mt-lg-0 ${
      isActive ? "show" : ""
    }`}
    id={targetId}
    style={style}
  >
    {children}
  </div>
);

export const NavbarNav = ({ children, className = "" }: IProps) => (
  <ul className={`navbar-nav ${className}`}>{children}</ul>
);

type INavItem =
  | {
      dropdown: true;
      id: string;
      isActive: boolean;
      toggler: React.ReactNode;
      children: React.ReactNode;
      className?: string;
    }
  | {
      dropdown?: false;
      id?: never;
      isActive?: never;
      toggler?: never;
      className?: string;
      children: React.ReactNode;
    };

export const NavItem = ({
  children,
  id,
  dropdown,
  toggler,
  isActive,
  className = "",
}: INavItem) => (
  <li className={`nav-item ${className}`}>
    {dropdown && (
      <Link
        to="#"
        id={id}
        className={`nav-link dropdown-toggle ${isActive ? "show" : ""}`}
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded={isActive}
      >
        {toggler}
      </Link>
    )}
    {children}
  </li>
);

interface ILink extends IProps {
  to: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
export const NavLink = ({
  disabled = false,
  children,
  className = "",
  to,
  isActive = false,
  onClick,
}: ILink) => (
  <Link
    to={to}
    className={`purple-link rounded ${className} ${
      isActive ? "active-purple-link" : ""
    }`}
    aria-disabled={disabled}
    onClick={onClick}
  >
    {children}
  </Link>
);

type queryType = "320" | "425" | "576" | "768" | "992" | "1024" | "1440";

interface INav {
  children: React.ReactNode;
  mediaQuery: queryType;
}
export const NavbarMenu = ({ children, mediaQuery }: INav) => {
  const media = useMedia(`(min-width: ${mediaQuery}px)`);
  const [isActive, setIsActive] = useState(true);
  const targetId = getUniqueID();
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!media) setIsActive(false);
  }, [media, pathname, search]);

  useEffect(() => {
    setIsActive(media);
  }, [media]);

  return (
    <>
      <NavbarToggler
        isActive={isActive}
        targetId={targetId}
        show={media}
        handler={() => setIsActive(!isActive)}
      />
      <NavbarCollapse isActive={isActive} targetId={targetId}>
        {children}
      </NavbarCollapse>
    </>
  );
};
