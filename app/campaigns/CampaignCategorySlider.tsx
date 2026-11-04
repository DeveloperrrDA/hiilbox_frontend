"use client";

import { useRef } from "react";
import Link from "next/link";

type CategoryItem = {
  label: string;
  href: string;
  active: boolean;
};

type Props = {
  items: CategoryItem[];
};

export default function CampaignCategorySlider({ items }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    sliderRef.current?.scrollBy({
      left: direction * 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-8 flex min-w-0 items-center gap-2">
      <button
        type="button"
        aria-label="Previous categories"
        onClick={() => scroll(-1)}
        className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-2"
      >
        ←
      </button>
      <div
        ref={sliderRef}
        className="flex min-w-0 flex-1 gap-3 overflow-x-auto scroll-smooth whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={`shrink-0 rounded-full border px-5 py-2 text-sm font-semibold transition ${
              item.active
                ? "border-[#01A14B] bg-[#01A14B] text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-[#01A14B]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <button
        type="button"
        aria-label="Next categories"
        onClick={() => scroll(1)}
        className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-2"
      >
        →
      </button>
    </div>
  );
}
