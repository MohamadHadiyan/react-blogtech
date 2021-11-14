import React from "react";
import { DefaultDropDownMenu, MenuItemType } from "./Dropdown";

const Filters = () => {
  const menuItems: MenuItemType[] = [
    {
      header: "Created Date",
      className:"me-3",
      items: [
        { title: "Last hour" },
        { title: "Today" },
        { title: "This week" },
        { title: "Last month" },
        { title: "Last year" },
      ],
    },
    {
      header: "Duration",
      items: [
        { title: "Under 3 minuts" },
        { title: "3-5 minuts" },
        { title: "5-10 minuts" },
        { title: "Over 10 minuts" },
      ],
    },
  ];

  return (
    <div className={`mb-4 pb-2 border-bottom`}>
      <DefaultDropDownMenu
        menuItems={menuItems}
        icon={
          <>
            <i className="fas fa-sliders-h" /> Filters
          </>
        }
        toggleClass="fs-4"
        menuClass="position-relative"
        transform="translate(0px, 10px)"
        headerClass="fs-6"
        horizantal
      />
    </div>
  );
};

export default Filters;
