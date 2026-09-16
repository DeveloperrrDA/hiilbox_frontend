export type DateRangeKey =
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year";

export const DATE_RANGE_OPTIONS: { value: DateRangeKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "last_90_days", label: "Last 90 days" },
  { value: "this_month", label: "This month" },
  { value: "last_month", label: "Last month" },
  { value: "this_year", label: "This year" },
  { value: "last_year", label: "Last year" },
];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getDateRange(key: DateRangeKey, now = new Date()) {
  const today = startOfDay(now);
  let start = today;
  let end = endOfDay(today);

  switch (key) {
    case "yesterday": {
      const yesterday = addDays(today, -1);
      start = yesterday;
      end = endOfDay(yesterday);
      break;
    }
    case "last_7_days":
      start = addDays(today, -6);
      break;
    case "last_30_days":
      start = addDays(today, -29);
      break;
    case "last_90_days":
      start = addDays(today, -89);
      break;
    case "this_month":
      start = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "last_month": {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = endOfDay(new Date(today.getFullYear(), today.getMonth(), 0));
      break;
    }
    case "this_year":
      start = new Date(today.getFullYear(), 0, 1);
      break;
    case "last_year":
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = endOfDay(new Date(today.getFullYear() - 1, 11, 31));
      break;
    case "today":
    default:
      break;
  }
  return { start, end };
}

export function formatDateParam(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function dateRangeParams(key: DateRangeKey) {
  const { start, end } = getDateRange(key);
  return { start_date: formatDateParam(start), end_date: formatDateParam(end) };
}

export function isDateInRange(value: unknown, key: DateRangeKey) {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return false;
  const { start, end } = getDateRange(key);
  return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
}
