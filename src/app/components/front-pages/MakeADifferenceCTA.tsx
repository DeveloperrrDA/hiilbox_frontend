import Link from "next/link";
import { Icon } from "@iconify/react";

export default function MakeADifferenceCTA() {
  return (
    <section className="mt-24 flex container-1218 flex-col items-center justify-between gap-16 py-16 lg:flex-row relative z-10">
      <div className="relative z-10 flex w-full flex-col items-start lg:w-1/2">
        <div className="flex items-center justify-center">
          <div className="mb-4 rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-primary dark:text-lightprimary">
            MAKE A DIFFERENCE TODAY
          </div>
        </div>

        <h2 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-[#0F1F17] dark:text-white md:text-5xl lg:text-[2.5rem]">
          Start Your Campaign<br />
          <span className="text-[#01A14B]">and Make a Real Impact</span>
        </h2>

        <p className="mb-10 max-w-lg text-lg leading-relaxed text-[#687280] dark:text-gray-300">
          Whether you're supporting a family, a community project, or a life-changing initiative, HiilBox gives you the tools to raise funds easily, securely, and transparently.
        </p>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:w-auto">
          <Link href="/create-campaign" className="group inline-flex w-full items-center justify-center space-x-2 rounded-full bg-[#01A14B] px-8 py-4 text-[15px] font-bold text-white shadow-[0_8px_20px_-8px_rgba(1,161,75,0.6)] transition hover:bg-[#006B30] dark:shadow-none sm:w-auto">
            <Icon icon="solar:add-circle-bold" className="text-lg" />
            <span>Start Your Campaign</span>
            <Icon icon="solar:arrow-right-bold" className="ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/campaigns" className="group inline-flex w-full items-center justify-center space-x-2 rounded-full border-2 border-[#01A14B] bg-transparent px-8 py-4 text-[15px] font-bold text-[#0F1F17] transition hover:bg-white/50 dark:border-gray-700 dark:text-white dark:hover:border-[#01A14B] dark:hover:bg-white/5 dark:hover:text-[#01A14B] sm:w-auto">
            <Icon icon="solar:magnifer-bold" className="text-lg" />
            <span>Explore Campaigns</span>
            <Icon icon="solar:arrow-right-bold" className="ml-2 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-10 flex w-full justify-center lg:mt-0 lg:w-1/2 lg:justify-end">
        <div className="absolute inset-0 z-0 scale-105 rotate-3 transform rounded-[4rem] bg-[#E6F4EB] blur-sm dark:bg-[#01A14B]/10"></div>
        <div className="absolute inset-0 z-0 scale-95 -rotate-2 transform rounded-[3rem] bg-[#01A14B]/20"></div>

        <div className="absolute -left-4 -top-8 z-20 text-[#01A14B] dark:text-[#8BD3A8]">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" /></svg>
        </div>
        <div className="absolute -bottom-4 right-10 z-20 text-[#01A14B] dark:text-[#8BD3A8]">
          <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"><path d="M10,50 Q30,10 50,50 T90,50" /></svg>
        </div>

        <div className="relative z-10 w-full max-w-[450px] -rotate-2 transform rounded-3xl border border-white/60 bg-white/40 p-3 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-xl transition-transform duration-500 hover:rotate-0 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <img src="https://hiilbox.com/about/fundraising_campaigns_in_action.png" alt="Make a Real Impact" className="h-auto w-full rounded-2xl object-cover" />
          <div className="absolute -right-4 -top-4 flex h-12 w-12 rotate-12 transform items-center justify-center rounded-xl border border-yellow-200/50 bg-[#FFF9C4]/80 shadow-md backdrop-blur-md dark:border-yellow-700/50 dark:bg-yellow-900/50">
            <Icon icon="solar:heart-bold" className="text-xl text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>
    </section>
  );
}