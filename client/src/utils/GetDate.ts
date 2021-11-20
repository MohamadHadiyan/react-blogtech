import moment from "moment";
import { DateFilter } from "../components/global/Filters";
import { IBlog } from "./TypeScript";

const getDiff = (createdAt: string) => {
  const timeFirst = moment(new Date(createdAt).getTime());
  const timeEnd = moment(Date.now());
  const diff = timeEnd.diff(timeFirst);
  const duration = moment.duration(diff);

  const years = duration.years();
  const months = duration.months();
  const weeks = duration.weeks();
  const days = duration.days();
  const hours = duration.hours();
  const mins = duration.minutes();

  return { years, months, weeks, days, hours, mins };
};

const getDate = (createdAt: string, optional?: { fullText: boolean }) => {
  let fullText = false;
  if (optional && optional.fullText) fullText = optional.fullText;

  const { years, months, days, hours, mins } = getDiff(createdAt);

  const date =
    years === 0 && months === 0 && days === 0 && hours === 0 && mins === 0
      ? `${fullText ? "Just now" : "now"}`
      : years === 0 && months === 0 && days === 0 && hours === 0
      ? `${mins}${fullText ? " mins ago" : "m"}`
      : years === 0 && months === 0 && days === 0 && hours < 2
      ? `${fullText ? "1 hour ago" : "1h"}`
      : years === 0 && months === 0 && days === 0
      ? `${hours}${fullText ? " hours ago" : "h"}`
      : years === 0 && months === 0 && days < 2
      ? `${fullText ? "1 day ago" : "1d"}`
      : years === 0 && months === 0
      ? `${days}${fullText ? " days ago" : "d"}`
      : years === 0 && months < 2
      ? `${fullText ? "1 month ago" : "1mo"}`
      : years === 0
      ? `${months}${fullText ? " months ago" : "mos"}`
      : years < 2
      ? `${fullText ? " year ago" : "1yr"}`
      : `${years}${fullText ? " years ago" : "yrs"}`;

  return date;
};

export const filterBlogs = (filter: DateFilter, blogs: IBlog[]) => {
  switch (filter) {
    case "Last hour":
      return blogs.filter((blog) => {
        const { years, months, days, hours } = getDiff(blog.createdAt);
        return years === 0 && months === 0 && days === 0 && hours === 0;
      });
    case "Today":
      return blogs.filter((blog) => {
        const { years, months, days } = getDiff(blog.createdAt);
        return years === 0 && months === 0 && days === 0;
      });
    case "This week":
      return blogs.filter((blog) => {
        const { years, months, weeks } = getDiff(blog.createdAt);
        return years === 0 && months === 0 && weeks === 0;
      });
    case "Last month":
      return blogs.filter((blog) => {
        const { years, months } = getDiff(blog.createdAt);
        return years === 0 && months === 0;
      });
    case "Last year":
      return blogs.filter((blog) => {
        const { years } = getDiff(blog.createdAt);
        return years === 0;
      });
    default:
      return blogs;
  }
};

export default getDate;
