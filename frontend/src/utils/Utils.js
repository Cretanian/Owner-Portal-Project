export function formatMonthRange(date) {
  if (!date) return;
  if (!(date instanceof Date)) date = new Date(date);

  const monthName = date.toLocaleString("default", { month: "short" });

  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  return `From 1 ${monthName} to ${lastDay} of ${monthName}`;
}

export function formatDayMonth(date) {
  if (!date) return;
  if (!(date instanceof Date)) date = new Date(date);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });

  return `${day} ${month}`;
}

export function getYear(date) {
  if (!date) return;
  if (!(date instanceof Date)) date = new Date(date);

  return date.getFullYear();
}
