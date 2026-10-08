import Link from "next/link";
import ThemeShell from "@/components/theme/ThemeShell";

export const metadata = {
  title: "How It Works - Hiilbox",
  description: "Learn how Hiilbox makes giving and receiving seamless, secure, and transparent.",
};

export default function HowItWorksPage() {
  return (
    <ThemeShell>
      {/* 
        We rely on ThemeShell to provide the root background, 
        but ensure the main wrapper responds to text color defaults 
      */}
      <main className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        
        {/* HERO SECTION */}
        <section className="mx-auto max-w-3xl py-20 text-center">
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.1] tracking-[-0.02em] text-[#0F1F17] dark:text-white md:text-6xl">
            How HiilBox Works
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-[#687280] dark:text-gray-300 md:text-xl">
            From sharing your story to delivering real impact, our platform is designed to make giving and receiving seamless, secure, and transparent.
          </p>
          <Link
            href="#steps"
            className="inline-flex items-center justify-center rounded-full bg-[#01A14B] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#006B30] dark:shadow-none"
          >
            See the Process
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </Link>
        </section>

        {/* STEPS GRID */}
        <section id="steps" className="mb-24 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Step 1 Card */}
          <div className="relative flex h-[450px] flex-col overflow-hidden rounded-[2rem] bg-[#F8F9FA] dark:bg-darkgray p-8 pb-0">
            <h3 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-[#006B30] dark:text-[#01A14B]">1. Create a Campaign</h3>
            <div className="mb-4 h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <p className="mb-8 text-[15px] leading-relaxed text-[#687280] dark:text-gray-300">
              Fundraisers can easily create campaigns by sharing their story, setting clear goals, and defining funding requirements.
            </p>
            
            <div className="relative mt-auto h-48 w-full">
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-tl-[3rem] bg-[radial-gradient(#D1FADF_2px,transparent_2px)] dark:bg-[radial-gradient(rgba(1,161,75,0.15)_2px,transparent_2px)] bg-[size:10px_10px]"></div>
              
              {/* Inner UI Mockup */}
              <div className="absolute bottom-[-20px] right-[-20px] h-40 w-64 rotate-[-2deg] transform rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-dark p-4 shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <div className="absolute -top-4 right-8 flex items-center gap-2 rounded-lg border border-[#01A14B] bg-white dark:bg-dark px-4 py-1.5 text-sm font-bold text-[#01A14B] shadow-[4px_4px_0px_rgba(1,161,75,0.2)] dark:shadow-[4px_4px_0px_rgba(1,161,75,0.4)]">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>{" "}
                  New Campaign
                </div>
                <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Campaign Title</div>
                <div className="mb-3 flex h-8 w-full items-center rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-2 text-xs text-gray-400 dark:text-gray-500">
                  e.g., Medical Fund
                </div>
                <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Story</div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-2 w-5/6 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="relative flex h-[450px] flex-col overflow-hidden rounded-[2rem] bg-[#F8F9FA] dark:bg-darkgray p-8 pb-0">
            <h3 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-[#006B30] dark:text-[#01A14B]">2. Verification & Review</h3>
            <div className="mb-4 h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <p className="mb-8 text-[15px] leading-relaxed text-[#687280] dark:text-gray-300">
              To maintain trust, campaigns are reviewed to help maintain platform integrity and ensure compliance with policies.
            </p>
            
            <div className="relative mt-auto h-48 w-full">
              <div className="absolute bottom-0 right-10 h-32 w-32 rounded-full bg-[radial-gradient(#D1FADF_2px,transparent_2px)] dark:bg-[radial-gradient(rgba(1,161,75,0.15)_2px,transparent_2px)] bg-[size:10px_10px]"></div>
              
              {/* Inner UI Mockup */}
              <div className="absolute bottom-10 left-4 z-10 w-56 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-dark p-5 shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <div className="absolute -top-5 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="mb-1 mt-3 text-center text-sm font-bold text-gray-800 dark:text-white">Identity Verified</div>
                <div className="text-center text-xs text-gray-500 dark:text-gray-400">KYC Check Complete</div>
                <div className="mt-4 flex items-center justify-center">
                  <div className="relative h-6 w-12 rounded-full bg-[#01A14B]">
                    <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="relative flex h-[450px] flex-col overflow-hidden rounded-[2rem] bg-[#F8F9FA] dark:bg-darkgray p-8 pb-0">
            <h3 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-[#006B30] dark:text-[#01A14B]">3. Share & Raise Funds</h3>
            <div className="mb-4 h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <p className="mb-8 text-[15px] leading-relaxed text-[#687280] dark:text-gray-300">
              Creators share campaigns through social media and community networks to reach supporters globally.
            </p>
            
            <div className="relative mt-auto h-48 w-full">
              <div className="absolute bottom-8 right-0 h-40 w-40 bg-[radial-gradient(#D1FADF_2px,transparent_2px)] dark:bg-[radial-gradient(rgba(1,161,75,0.15)_2px,transparent_2px)] bg-[size:10px_10px]"></div>
              
              {/* Inner UI Mockup */}
              <div className="absolute bottom-[-10px] right-4 w-60 rotate-[2deg] transform rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-dark p-4 shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <div className="absolute -top-3 right-4 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-dark bg-orange-500 text-white shadow-md">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <div className="mb-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Share Campaign</div>
                <div className="mb-3 flex justify-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-800/40 text-blue-800 dark:text-blue-300">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                </div>
                <div className="flex h-8 w-full items-center justify-between rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-2">
                  <span className="w-3/4 truncate text-xs text-gray-400 dark:text-gray-500">hiilbox.com/f/medical...</span>
                  <span className="cursor-pointer text-xs font-bold text-[#01A14B]">Copy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 Card */}
          <div className="relative flex h-[450px] flex-col overflow-hidden rounded-[2rem] bg-[#F8F9FA] dark:bg-darkgray p-8 pb-0">
            <h3 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-[#006B30] dark:text-[#01A14B]">4. Receive Donations</h3>
            <div className="mb-4 h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <p className="mb-8 text-[15px] leading-relaxed text-[#687280] dark:text-gray-300">
              Donors contribute securely while tracking campaign progress in real time. We support USD and SLSH.
            </p>
            
            <div className="relative mt-auto flex h-48 w-full justify-center">
              <div className="absolute left-10 top-4 h-24 w-24 bg-[radial-gradient(#D1FADF_2px,transparent_2px)] dark:bg-[radial-gradient(rgba(1,161,75,0.15)_2px,transparent_2px)] bg-[size:10px_10px]"></div>
              
              {/* Inner UI Mockup */}
              <div className="absolute bottom-4 z-10 w-64 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-dark p-4 shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <div className="mb-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Recent Donation</span>
                  <span className="text-xs font-bold text-[#01A14B]">+$50.00</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-800 dark:text-white">Anonymous</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">2 mins ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5 Card */}
          <div className="relative flex h-[450px] flex-col overflow-hidden rounded-[2rem] bg-[#F8F9FA] dark:bg-darkgray p-8 pb-0">
            <h3 className="mb-4 text-2xl font-bold tracking-[-0.02em] text-[#006B30] dark:text-[#01A14B]">5. Make an Impact</h3>
            <div className="mb-4 h-px w-full bg-gray-200 dark:bg-gray-700"></div>
            <p className="mb-8 text-[15px] leading-relaxed text-[#687280] dark:text-gray-300">
              Funds raised help individuals and communities achieve their goals and create meaningful change.
            </p>
            
            <div className="relative mt-auto h-48 w-full">
              <div className="absolute bottom-0 left-0 h-32 w-full opacity-50 dark:opacity-20 bg-[radial-gradient(#D1FADF_2px,transparent_2px)] bg-[size:10px_10px]"></div>
              
              {/* Inner UI Mockup */}
              <div className="absolute bottom-[-10px] left-1/2 w-64 -translate-x-1/2 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-dark p-5 text-center shadow-lg dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
                <div className="mb-2 inline-block rounded-full bg-[#E6F4EB] dark:bg-[#003D1B] p-2 text-[#01A14B] dark:text-[#8BD3A8]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="mb-1 text-sm font-bold text-gray-800 dark:text-white">Goal Reached!</div>
                <div className="mb-2 text-2xl font-black text-[#01A14B]">$5,000</div>
                <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-2 w-full rounded-full bg-[#01A14B]"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transparency Callout Card */}
          <div className="relative flex h-[450px] flex-col overflow-hidden rounded-[2rem] bg-[#003D1B] dark:bg-[#0F1F17] dark:border dark:border-gray-800 p-8 text-white">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_2px,transparent_2px)] bg-[size:15px_15px]"></div>
            <h3 className="relative z-10 mb-4 text-2xl font-bold tracking-[-0.02em] text-[#8BD3A8]">Transparency & Accountability</h3>
            <div className="relative z-10 mb-4 h-px w-full bg-white/20 dark:bg-gray-800"></div>
            <p className="relative z-10 mb-8 text-[15px] leading-relaxed text-white/80 dark:text-gray-400">
              Trust is at the heart of everything we do. We maintain high standards through campaign reviews, fundraising oversight, and donor reporting.
            </p>
            <div className="relative z-10 mt-auto flex justify-center pb-4">
              <svg className="h-24 w-24 text-white/20 dark:text-[#003D1B]/50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>

        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="mx-auto flex max-w-4xl flex-col items-center rounded-[2rem] bg-[#E6F4EB] dark:bg-darkgray dark:border dark:border-gray-800 p-12 text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-[-0.02em] text-[#0F1F17] dark:text-white">Ready to start your journey?</h2>
          <p className="mb-8 max-w-xl text-[#687280] dark:text-gray-300">
            Join thousands of others who are using HiilBox to fundraise for important causes and make a difference in their communities.
          </p>
          <Link
            href="/create-campaign"
            className="rounded-full bg-[#01A14B] px-8 py-3.5 text-lg font-bold text-white shadow-lg transition hover:bg-[#006B30] dark:shadow-none"
          >
            Start a Campaign
          </Link>
        </section>

      </main>
    </ThemeShell>
  );
}