import Link from "next/link";
import { Icon } from "@iconify/react";

export default function CenteredCTA() {
  return (
    <section className="py-10 md:py-16 lg:py-20 relative z-10 container-1218 rounded-lg overflow-hidden bg-[#01A14B]/20 dark:bg-[#01A14B]/5">
      
      {/* =========================================
          BACKGROUND GRAPHICS (Full Width)
      ========================================= */}
      {/* Bottom Left Circle */}
      <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-[#01A14B]/10 dark:bg-[#01A14B]/10"></div>
      {/* Top Right Circles */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#01A14B]/10 dark:bg-[#01A14B]/10"></div>
      <div className="absolute -right-40 top-10 h-80 w-80 rounded-full bg-[#01A14B]/5 dark:bg-[#01A14B]/5"></div>

      {/* Bottom Left Wavy Line */}
      <svg
        className="absolute bottom-0 left-0 w-64 text-[#01A14B] opacity-60 dark:opacity-40 sm:w-96"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-50,150 C50,250 150,50 250,250 C300,350 400,200 450,250"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Top Right Wavy Line */}
      <svg
        className="absolute right-0 top-0 w-64 text-[#01A14B] opacity-60 dark:opacity-40 sm:w-96"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M300,-50 C250,100 400,150 250,250 C150,300 200,450 150,450"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* =========================================
          CONTENT (Constrained Width)
      ========================================= */}
      <div className="container-1218 mx-auto relative z-10 flex w-full flex-col items-center justify-center px-6 py-16 text-center md:py-20 lg:py-24">
        <div className="flex max-w-2xl flex-col items-center">
          
          {/* Eyebrow */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-[#01A14B] dark:text-[#8BD3A8]"
            >
              <path d="M12 4 L11 8 M5 9 L8 11 M3 15 L7 14" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#01A14B] dark:text-[#8BD3A8]">
              Together we create real change
            </span>
          </div>

          {/* Headline */}
          <h2 className="mb-5 text-4xl font-black leading-[1.15] tracking-tight text-[#0F1F17] dark:text-white md:text-5xl lg:text-[3.5rem]">
            Create Your <br className="hidden sm:block" />
            <span className="text-[#01A14B]">HiilBox</span> Account Today
          </h2>

          {/* Subheadline */}
          <p className="mx-auto max-w-[500px] text-base leading-relaxed text-[#687280] dark:text-gray-300 md:text-lg">
            Join a trusted platform where people come together to support causes, empower communities, and build a brighter future.
          </p>

          {/* Action Button */}
          <Link
            href="/create-campaign"
            className="group mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#01A14B] px-8 py-3.5 text-[15px] font-bold text-white transition-all hover:bg-[#006B30] hover:shadow-lg hover:shadow-[#01A14B]/20"
          >
            <span>Create Your HiilBox Account</span>
            <Icon
              icon="solar:arrow-right-line-duotone"
              className="text-lg transition-transform group-hover:translate-x-1"
            />
          </Link>
          
        </div>
      </div>
    </section>
  );
}