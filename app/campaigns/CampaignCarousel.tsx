"use client";

import { Children, useState, type ReactNode } from "react";

type Props = { children: ReactNode };
const PER_SLIDE = 6;

export default function CampaignCarousel({ children }: Props) {
  const cards = Children.toArray(children);
  const groups: ReactNode[][] = [];
  for (let i = 0; i < cards.length; i += PER_SLIDE) {
    groups.push(cards.slice(i, i + PER_SLIDE));
  }
  const [index, setIndex] = useState(0);
  const active = Math.min(index, Math.max(0, groups.length - 1));

  return (
    <section aria-label="Browse campaigns" className="min-w-0">
      {/* Mobile: compact vertical list, using the unchanged homepage CampaignCard. */}
      <div className="flex flex-col gap-5 sm:hidden">
        {cards.map((card, i) => (
          <div key={i} className="min-w-0 border-b border-gray-100 pb-4 last:border-0">
            {card}
          </div>
        ))}
      </div>

      {/* Tablet / desktop: two rows of three cards per slide. */}
      <div className="relative hidden min-w-0 sm:block">
        {groups.length > 1 && (
          <button
            type="button"
            aria-label="Previous campaigns"
            onClick={() => setIndex(Math.max(0, active - 1))}
            disabled={active === 0}
            className="absolute -left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl shadow-md disabled:cursor-not-allowed disabled:opacity-40 lg:-left-6"
          >‹</button>
        )}
        <div className="min-w-0 overflow-hidden">
          <div
            className="flex items-start transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {groups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="grid w-full min-w-0 shrink-0 grid-cols-2 gap-x-7 gap-y-10 px-2 lg:grid-cols-3"
              >
                {group.map((card, cardIndex) => (
                  <div key={cardIndex} className="min-w-0 overflow-hidden">
                    {card}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        {groups.length > 1 && (
          <button
            type="button"
            aria-label="Next campaigns"
            onClick={() => setIndex(Math.min(groups.length - 1, active + 1))}
            disabled={active === groups.length - 1}
            className="absolute -right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl shadow-md disabled:cursor-not-allowed disabled:opacity-40 lg:-right-6"
          >›</button>
        )}
      </div>
    </section>
  );
}
