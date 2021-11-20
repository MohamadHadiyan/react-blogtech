import React from "react";
import getUniqueID from "../../utils/GetUniqueID";

interface IProps {
  isDesktop: boolean;
  label?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}
const MobileItem = ({ isDesktop, label, icon, children }: IProps) => {
  const unique_id = getUniqueID();
  return (
    <li
      className={`d-block d-lg-none w-100 dropdown ${
        isDesktop ? "" : "border-bottom"
      }`}
    >
      <span
        className={`nav-link text-link py-lg-0`}
        id={unique_id}
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <span className="border d-inline-block rounded-circle text-center avatar-md p-1">
          {icon}
        </span>
        {!isDesktop && <span className="ms-2 fw-semi-bold">{label}</span>}
      </span>

      <div
        className="right-0 left-auto dropdown-menu shadow p-2 mb-2 "
        aria-labelledby={unique_id}
      >
        {children}
      </div>
    </li>
  );
};

export default MobileItem;
