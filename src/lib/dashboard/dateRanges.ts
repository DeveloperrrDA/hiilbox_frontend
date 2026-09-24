export type DateRangeKey =
  | "all"
  | "today"
  | "yesterday"
  | "last_7_days"
  | "last_30_days"
  | "last_90_days"
  | "this_month"
  | "last_month"
  | "this_year"
  | "last_year"
  | "custom";

export const DATE_RANGE_OPTIONS: {
  value: Exclude<DateRangeKey, "custom">;
  label: string;
}[] = [
  { value: "all", label: "All" },
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
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function endOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function getDateRange(key: DateRangeKey, now = new Date()) {
  const today = startOfDay(now);

  let start = today;
  let end = endOfDay(today);

  switch (key) {
    case "yesterday": {
      const yesterday = addDays(today, -1);
      start = startOfDay(yesterday);
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

    case "last_month":
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = endOfDay(
        new Date(today.getFullYear(), today.getMonth(), 0)
      );
      break;

    case "this_year":
      start = new Date(today.getFullYear(), 0, 1);
      break;

    case "last_year":
      start = new Date(today.getFullYear() - 1, 0, 1);
      end = endOfDay(
        new Date(today.getFullYear() - 1, 11, 31)
      );
      break;

    case "all":
    case "custom":
    case "today":
    default:
      break;
  }

  return { start, end };
}

export function formatDateParam(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function dateRangeParams(
  key: DateRangeKey
): Record<string, string> {
  if (key === "all" || key === "custom") {
    return {};
  }

  const { start, end } = getDateRange(key);

  return {
    start_date: formatDateParam(start),
    end_date: formatDateParam(end),
  };
}
export function isDateInRange(value: string, key: DateRangeKey) {
  if (key === "all" || key === "custom") {
    return true;
  }

  if (!value) return false;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const { start, end } = getDateRange(key);

  return date >= start && date <= end;
}