import React, { createContext, useContext, useEffect, useState } from "react";
import { HTMLAttributes } from "react";
import getUniqueID from "../../utils/GetUniqueID";
import ActiveLink, { LinkLocation, TargetType } from "./ActiveLink";

interface IContext {
  isOpen: boolean;
  toggle: () => void;
}

const DropdownContext = createContext<IContext | null>(null);
const DropdownProvider = DropdownContext.Provider;

interface IDropdown {
  children: React.ReactNode;
  isOpen?: boolean;
  toggle: () => void;
}
export const Dropdown = ({ children, isOpen = false, toggle }: IDropdown) => {
  useEffect(() => {
    if (!isOpen) return;

    document.addEventListener("click", toggle);

    return () => {
      document.removeEventListener("click", toggle);
    };
  }, [isOpen, toggle]);
  return (
    <DropdownProvider value={{ isOpen, toggle }}>
      <div className="position-relative">{children}</div>
    </DropdownProvider>
  );
};

interface IMenu {
  children: React.ReactNode;
  className?: string;
  style?: HTMLAttributes<HTMLDivElement>["style"];
  id: string;
}

export const DropdownMenu = ({ style, children, className, id }: IMenu) => {
  const { isOpen } = useContext(DropdownContext) as IContext;
  return (
    <div
      className={`dropdown-menu p-2 shadow border-0 ${isOpen ? "show" : ""} ${
        className ? className : ""
      }`}
      aria-labelledby={id}
      style={style}
    >
      {children}
    </div>
  );
};

interface IToggle {
  children: React.ReactNode;
  id: string;
  className?: string;
}
export const DropdownToggle = ({ children, id, className = "" }: IToggle) => {
  const { toggle } = useContext(DropdownContext) as IContext;
  const padding = className.includes("p-");
  return (
    <div className={`dropdown ${padding ? className : "p-2" + className}`}>
      <div
        onClick={toggle}
        id={id}
        className={`text-decoration-none text-secondary ${
          padding ? className : "p-1" + className
        } cursor-pointer`}
      >
        {children}
      </div>
    </div>
  );
};

interface IHeader {
  children: React.ReactNode;
  className?: string;
}
export const DropdownHeader = ({ children, className = "" }: IHeader) => {
  return (
    <h3 className={`dropdown-header fw-bold ${className}`}>
      <small className="text-uppercase">{children}</small>
    </h3>
  );
};

interface IItem {
  children: React.ReactNode;
  to?: string | LinkLocation;
  target?: TargetType;
  className?: string;
  onClick?: () => void;
}
export const DropdownItem = ({
  to,
  children,
  className = "",
  onClick,
  target,
}: IItem) => {
  return to ? (
    <ActiveLink
      to={to}
      target={target || "_self"}
      className={`dropdown-item rounded ${className}`}
    >
      {children}
    </ActiveLink>
  ) : (
    <div className={`dropdown-item rounded ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export const DropdownDivider = () => <hr className="dropdown-divider" />;

/* ============== Default DropDown Menu ================ */
type MenuItemPropsType = {
  to?: string | LinkLocation;
  title?: string;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  target?: TargetType;
};

export type MenuItemType = {
  header?: string;
  divider?: boolean;
  className?: string;
  itemsClass?: string;
  items: MenuItemPropsType[];
};

interface IDefault {
  menuItems: MenuItemType[];
  transform?: string;
  isOpen?: boolean;
  toggle?: () => void;
  toggleClass?: string;
  menuClass?: string;
  headerClass?: string;
  icon?: React.ReactNode;
  horizantal?: boolean;
  toggleChild?: React.ReactNode;
}

export const DefaultDropDownMenu = ({
  menuItems,
  transform,
  isOpen,
  toggle,
  toggleClass = "",
  menuClass = "",
  headerClass = "",
  icon,
  toggleChild,
  horizantal,
  ...res
}: IDefault & HTMLAttributes<HTMLDivElement>) => {
  const [state, setState] = useState(false);
  const id = getUniqueID();
  const toggleIcon = icon ? (
    icon
  ) : (
    <i className="fas fa-ellipsis-v text-secondary" />
  );

  const handleState = () => {
    setState(!state);
  };

  useEffect(() => {
    return () => setState(false);
  }, []);

  const CN = (itemsClass?: string) =>
    `cursor-pointer fw-semi-bold ${itemsClass || ""} `;

  return (
    <Dropdown isOpen={isOpen || state} toggle={toggle ? toggle : handleState}>
      <DropdownToggle id={id} className={toggleClass}>
        {toggleIcon}
        {toggleChild}
      </DropdownToggle>
      <DropdownMenu
        id={id}
        style={{ transform: transform ? transform : "translate(-30px, -20px)" }}
        className={`top-right ${menuClass} ${
          horizantal && (isOpen || state) ? "d-flex flex-wrap" : ""
        }`}
        {...res}
      >
        {menuItems.map((menuItem) => (
          <div className={menuItem.className || ""} key={getUniqueID()}>
            {menuItem.header && (
              <DropdownHeader className={`fs-6 ${headerClass}`}>
                {menuItem.header}
              </DropdownHeader>
            )}
            {menuItem.items.map((item) =>
              item.to ? (
                <DropdownItem
                  key={getUniqueID()}
                  to={item.to}
                  target={item.target}
                  className={
                    item.className
                      ? CN(menuItem.itemsClass) + item.className
                      : CN(menuItem.itemsClass)
                  }
                >
                  {item.icon}
                  {item.title}
                  {item.children}
                </DropdownItem>
              ) : (
                <DropdownItem
                  key={getUniqueID()}
                  onClick={item.onClick}
                  className={
                    item.className
                      ? CN(menuItem.itemsClass) + item.className
                      : CN(menuItem.itemsClass)
                  }
                >
                  {item.icon}
                  {item.title}
                  {item.children}
                </DropdownItem>
              )
            )}
            {menuItem.divider && <DropdownDivider />}
          </div>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
