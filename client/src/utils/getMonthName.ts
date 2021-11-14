export default function getMonthName(date?: string) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = date ? new Date(date) : new Date();
  const monthNum = d.getMonth();
  const year = d.getFullYear();
  const monthName = monthNames[monthNum];

  return { year, monthNum, monthName };
}
