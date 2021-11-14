import moment from "moment";

const getDate = (createdAt: string, optional?: { fullText: boolean }) => {
  const timeFirst = moment(new Date(createdAt).getTime());
  const timeEnd = moment(Date.now());
  const diff = timeEnd.diff(timeFirst);
  const diffTime = moment.duration(diff);

  const years = diffTime.years();
  const months = diffTime.months();
  const days = diffTime.days();
  const hours = diffTime.hours();
  const mins = diffTime.minutes();

  let fullText = false;
  if (optional && optional.fullText) fullText = optional.fullText;

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

export default getDate;
