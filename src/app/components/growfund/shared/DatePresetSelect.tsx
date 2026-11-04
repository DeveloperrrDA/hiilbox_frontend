"use client";

import { useMemo } from "react";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  DATE_RANGE_OPTIONS,
  formatDateParam,
  getDateRange,
  type DateRangeKey,
} from "@/lib/dashboard/dateRanges";

type Props = {
  value: DateRangeKey;
  onChange: (value: DateRangeKey) => void;

  startDate?: string;
  endDate?: string;

  onStartDateChange?: (value: string) => void;
  onEndDateChange?: (value: string) => void;

  className?: string;
};

function parseInputDate(value?: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

export default function DatePresetSelect({
  value,
  onChange,
  startDate = "",
  endDate = "",
  onStartDateChange,
  onEndDateChange,
  className = "",
}: Props) {
  const customStart = parseInputDate(startDate);
  const customEnd = parseInputDate(endDate);

  const selectedRange = useMemo(() => {
    if (value === "all") {
      return {
        start: null as Date | null,
        end: null as Date | null,
      };
    }

    if (value === "custom") {
      return {
        start: customStart,
        end: customEnd,
      };
    }

    const range = getDateRange(value);

    return {
      start: range.start,
      end: range.end,
    };
  }, [value, startDate, endDate]);

  const displayLabel = useMemo(() => {
    if (value === "all") {
      return "All dates";
    }

    if (selectedRange.start && selectedRange.end) {
      return `${formatDisplayDate(
        selectedRange.start
      )} – ${formatDisplayDate(selectedRange.end)}`;
    }

    if (selectedRange.start) {
      return `${formatDisplayDate(selectedRange.start)} – Select end`;
    }

    return "Select date range";
  }, [value, selectedRange]);

  const selectPreset = (nextValue: DateRangeKey) => {
    onChange(nextValue);

    // Presets calculate their own range.
    // Clear any old custom range.
    onStartDateChange?.("");
    onEndDateChange?.("");
  };

  const resetRange = () => {
    onChange("all");
    onStartDateChange?.("");
    onEndDateChange?.("");
  };

  const handleCalendarChange = (
    dates: [Date | null, Date | null]
  ) => {
    const [start, end] = dates;

    onChange("custom");

    onStartDateChange?.(
      start ? formatDateParam(start) : ""
    );

    onEndDateChange?.(
      end ? formatDateParam(end) : ""
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex min-h-10 min-w-[240px] items-center justify-between gap-3 rounded-md border border-ld bg-transparent px-3 py-2 text-left text-sm outline-none transition hover:bg-lightgray dark:hover:bg-darkgray ${className}`}
        >
          <span className="flex min-w-0 items-center gap-2">
            <Icon
              icon="solar:calendar-line-duotone"
              className="shrink-0 text-lg"
            />

            <span className="truncate">
              {displayLabel}
            </span>
          </span>

          <Icon
            icon="solar:alt-arrow-down-linear"
            className="shrink-0 text-base"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-auto max-w-[95vw] p-0"
      >
        <div className="flex flex-col overflow-hidden md:flex-row">
          {/* PRESETS */}
          <div className="min-w-[175px] border-b border-ld p-3 md:border-b-0 md:border-r">
            <div className="flex flex-col gap-1">
              {DATE_RANGE_OPTIONS.map((option) => {
                const active = value === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => selectPreset(option.value)}
                    className={`rounded-md px-3 py-2 text-left text-sm transition ${
                      active
                        ? "bg-primary text-white"
                        : "text-dark hover:bg-lightgray dark:text-white dark:hover:bg-darkgray"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="my-2 border-t border-ld" />

            <button
              type="button"
              onClick={resetRange}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-darklink transition hover:bg-lightgray dark:hover:bg-darkgray"
            >
              Reset
            </button>
          </div>

          {/* CALENDAR */}
          <div className="p-3">
            <DatePicker
              inline
              selectsRange
              startDate={selectedRange.start}
              endDate={selectedRange.end}
              onChange={handleCalendarChange}
              calendarStartDay={1}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}