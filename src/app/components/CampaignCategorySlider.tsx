"use client";

import Link from "next/link";
import { useRef } from "react";

type CategoryItem = {
  label: string;
  href: string;
  active: boolean;
};

export default function CampaignCategorySlider({ items }: { items: CategoryItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: -1 | 1) => {
    scrollRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  };

  return (
    <div className="mb-9 flex w-full items-center gap-2">
      <button
        type="button"
        aria-label="Scroll categories left"
        onClick={() => scroll(-1)}
        className="shrink-0 rounded-full border border-[#dfe5eb] bg-white px-3 py-2 text-[#111c2d] hover:border-[#01A14B]"
      >
        ←
      </button>
      <div
        ref={scrollRef}
        className="flex min-w-0 flex-1 gap-3 overflow-x-auto scroll-smooth py-2"
        aria-label="Campaign categories"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              item.active
                ? "border-[#01A14B] bg-[#01A14B] text-white"
                : "border-[#dfe5eb] bg-white text-[#111c2d] hover:border-[#01A14B] hover:text-[#01A14B]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <button
        type="button"
        aria-label="Scroll categories right"
        onClick={() => scroll(1)}
        className="shrink-0 rounded-full border border-[#dfe5eb] bg-white px-3 py-2 text-[#111c2d] hover:border-[#01A14B]"
      >
        →
      </button>
    </div>
  );
}
