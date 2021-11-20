import React, { useState } from "react";
import { filterBlogs } from "../../utils/GetDate";
import { IBlog } from "../../utils/TypeScript";
import { DefaultDropDownMenu, MenuItemType } from "./Dropdown";

export type DateFilter =
  | "Last hour"
  | "Today"
  | "This week"
  | "Last month"
  | "Last year"
  | "";

type DurationFilter =
  | "Under 3 minuts"
  | "3-5 minuts"
  | "5-10 minuts"
  | "Over 10 minuts"
  | "";

interface IDuration {
  label: DurationFilter;
  value: 3 | 5 | 10 | 15;
}

export type DateFilterType = {
  filter: DateFilter;
  count: number;
};
export type DurFilterType = {
  filter: DurationFilter;
  count: number;
  value: 3 | 5 | 10 | 15;
};
interface IProps {
  callbackFilter: (blogs: IBlog[]) => void;
  blogs: IBlog[];
}

const Filters = ({ callbackFilter, blogs }: IProps) => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>({
    filter: "",
    count: 0,
  });

  const [durFilter, setDurFilter] = useState<DurFilterType>({
    filter: "",
    count: 0,
    value: 15,
  });

  const selected = (name: DateFilter | DurationFilter) => {
    return dateFilter.filter === name || durFilter.filter === name;
  };

  const handleFilter = (type: "date" | "duration") => {
    if (type === "date") {
      const f_blogs = filterBlogs(dateFilter.filter, blogs);

      callbackFilter(f_blogs);
    } else {
      const f_blogs = blogs.filter(
        (blog) => blog.readingTime && blog.readingTime === durFilter.value
      );

      callbackFilter(f_blogs);
    }
  };

  const handleDateFilter = (value: DateFilter) => {
    let data = {} as DateFilterType;

    if (dateFilter.filter === value) {
      data = { ...dateFilter, filter: "", count: 0 };
      setDateFilter(data);

      if (durFilter.filter !== "") {
        handleFilter("duration");
      } else {
        callbackFilter(blogs);
      }
    } else {
      const f_blogs = filterBlogs(value, blogs);

      data = { ...dateFilter, filter: value, count: f_blogs.length };
      setDateFilter(data);
      callbackFilter(f_blogs);
    }
  };

  const handleDurFilter = (filter: IDuration) => {
    let data = {} as DurFilterType;

    if (durFilter.filter === filter.label) {
      data = { ...durFilter, filter: "", count: 0 };
      setDurFilter(data);

      if (dateFilter.filter !== "") {
        handleFilter("date");
      } else {
        callbackFilter(blogs);
      }
    } else {
      const f_blogs = blogs.filter(
        (blog) => blog.readingTime && blog.readingTime === filter.value
      );

      data = {
        filter: filter.label,
        count: f_blogs.length,
        value: filter.value,
      };
      setDurFilter(data);
      callbackFilter(f_blogs);
    }
  };

  const menuItems: MenuItemType[] = [
    {
      header: "Created Date",
      className: "me-3",
      itemsClass: "d-flex align-items-center",
      items: (
        [
          "Last hour",
          "Today",
          "This week",
          "Last month",
          "Last year",
        ] as DateFilter[]
      ).map((item) => {
        return {
          title: item,
          className: selected(item) ? "active" : "",
          onClick: () => handleDateFilter(item),
          children: selected(item) && (
            <i className="fas fa-times ps-2 ms-auto" />
          ),
        };
      }),
    },
    {
      header: "Duration",
      itemsClass: "d-flex align-items-center",
      items: (
        [
          { label: "Under 3 minuts", value: 3 },
          { label: "3-5 minuts", value: 5 },
          { label: "5-10 minuts", value: 10 },
          { label: "Over 10 minuts", value: 15 },
        ] as IDuration[]
      ).map((item) => {
        return {
          title: item.label,
          className: selected(item.label) ? "active" : "",
          onClick: () => handleDurFilter(item),
          children: selected(item.label) && (
            <i className="fas fa-times ps-2 ms-auto" />
          ),
        };
      }),
    },
  ];

  return (
    <div className="pt-2">
      <div className="mb-2 mb-lg-4 pb-2 border-bottom">
        <DefaultDropDownMenu
          menuItems={menuItems}
          toggleChild={
            ((dateFilter.filter && !dateFilter.count) ||
              (durFilter.filter && !durFilter.count)) && (
              <div className="d-md-inline-block">
                There is no blog with these filters, Please change the filters.
              </div>
            )
          }
          icon={
            <>
              <span>
                <i className="fas fa-sliders-h" /> Filters
              </span>
              {dateFilter.filter && (
                <span className="p-1 active-purple-link rounded mx-2">
                  {dateFilter.filter}
                </span>
              )}
              {durFilter.filter && (
                <span className="p-1 active-purple-link rounded mx-1">
                  {durFilter.filter}
                </span>
              )}
            </>
          }
          toggleClass="fs-4"
          menuClass="position-relative"
          transform="translate(0px, 10px)"
          headerClass="fs-6"
          horizantal
        />
      </div>
    </div>
  );
};

export default Filters;
