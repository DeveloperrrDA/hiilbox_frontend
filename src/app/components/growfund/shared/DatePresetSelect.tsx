"use client";
import { Icon } from "@iconify/react";
import { DATE_RANGE_OPTIONS, type DateRangeKey } from "@/lib/dashboard/dateRanges";

export default function DatePresetSelect({ value, onChange, className = "" }: { value: DateRangeKey; onChange: (value: DateRangeKey) => void; className?: string }) {
  return (
    <label className={`flex min-w-[180px] items-center gap-2 rounded-md border border-ld bg-transparent px-3 py-2.5 text-sm ${className}`}>
      <Icon icon="solar:calendar-line-duotone" height={18} className="shrink-0 text-darklink" />
      <select aria-label="Date range" value={value} onChange={(e) => onChange(e.target.value as DateRangeKey)} className="w-full bg-transparent outline-none">
        {DATE_RANGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}
