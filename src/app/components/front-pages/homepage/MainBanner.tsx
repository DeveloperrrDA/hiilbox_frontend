import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HeroRecentDonations from "@/app/components/front-pages/HeroRecentDonations";
import { getRecentDonations } from "@/lib/donations";

const MainBanner = async () => {
  const placeholderImg = "https://cdn.hiilbox.com/2026/06/A-Trusted-Way-to-Raise-Funds-Online-Hiilbox.webp";
  
  // Fetch global recent donations on the server
  let recentDonations: Awaited<ReturnType<typeof getRecentDonations>> = [];

try {
  recentDonations = await getRecentDonations();
} catch (error) {
  console.error("Homepage recent donations failed:", error);
}

  return (
    <div className="bg-[#FAFAFA] dark:bg-darkgray overflow-hidden">
      <div className="container-1218 mx-auto px-6 py-16 lg:py-20">
        
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          
          {/* ================= LEFT COLUMN: COPY & CTAs ================= */}
          <div className="hiilbox-hero-enter col-span-1 flex flex-col items-center text-center lg:col-span-5 xl:col-span-5 lg:items-start lg:text-left">
            
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-lightprimary px-4 py-2 text-xs font-bold text-primary shadow-sm dark:bg-primary/10">
              <Icon icon="solar:shield-check-bold" className="text-lg" />
              <span className="uppercase tracking-wide">Somali Crowdfunding Platform</span>
            </div>

            <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-[#0F1F17] dark:text-white md:text-5xl lg:text-[2.5rem]">
              A Trusted Way to <br className="hidden sm:block" />
              Raise Funds <br className="hidden sm:block" />
              <span className="text-primary">Online with HiilBox</span>
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed text-[#687280] dark:text-gray-300">
              A transparent crowdfunding platform that helps people support one another through secure, meaningful donations. Create your campaign, share your story, and reach supporters locally and around the world.
            </p>

            {/* Buttons */}
            <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button asChild size="lg" className="h-14 rounded-full bg-primary px-8 text-base font-bold hover:bg-primary/80">
                <Link href="/create-campaign">
                  Start Your Campaign <Icon icon="solar:arrow-right-line-duotone" className="ml-2 text-xl" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="h-14 rounded-full border-2 border-gray-200 px-8 text-base font-bold text-[#0F1F17] hover:border-primary hover:text-primary dark:border-gray-700 dark:text-white dark:hover:border-primary">
                <Link href="/campaigns">
                  <Icon icon="solar:magnifer-linear" className="mr-2 text-xl" /> Explore Campaigns
                </Link>
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <div className="flex -space-x-3">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-dark" alt="Supporter" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-dark" alt="Supporter" />
                <img src="https://randomuser.me/api/portraits/men/46.jpg" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-dark" alt="Supporter" />
                <img src="https://randomuser.me/api/portraits/women/68.jpg" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-dark" alt="Supporter" />
                <img src="https://randomuser.me/api/portraits/men/90.jpg" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-dark" alt="Supporter" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-lightprimary text-xs font-bold text-primary shadow-sm dark:border-dark dark:bg-primary/20">
                  10K+
                </div>
              </div>
              <p className="text-sm font-medium text-[#687280] dark:text-gray-400 sm:text-left">
                Join thousands of people <br className="hidden sm:block" /> making a difference
              </p>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: CARDS & TICKER ================= */}
          <div className="col-span-1 hidden lg:flex flex-col lg:col-span-7 xl:col-span-7 relative z-10 py-10">
            
            {/* Background decorative abstract shapes */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              {/* Main glowing light green blob */}
              <div className="absolute top-1/2 left-1/2 h-[450px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-lightprimary/80 blur-3xl dark:bg-primary/10"></div>
              
              {/* Secondary darker green blob on the right */}
              <div className="absolute -right-10 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10"></div>
              
              {/* Bottom left green tint */}
              <div className="absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-primary/10 blur-2xl dark:bg-primary/5"></div>

              {/* Dot Pattern Graphic */}
              <div className="absolute right-12 top-4 h-24 w-32 bg-[radial-gradient(var(--primary)_2px,transparent_2px)] bg-[size:16px_16px] opacity-30"></div>
              
              {/* Animated abstract dash marks (///) */}
              <div className="absolute left-16 top-16 flex -rotate-12 gap-2.5 opacity-80">
                <div className="h-6 w-2 -rotate-45 rounded-full bg-primary"></div>
                <div className="h-10 w-2 -translate-y-4 -rotate-45 rounded-full bg-primary"></div>
                <div className="h-6 w-2 -translate-y-1 -rotate-45 rounded-full bg-primary"></div>
              </div>
            </div>

            {/* Overlapping Cards Container */}
            <div className="relative h-[440px] w-full flex items-center justify-center mb-10 z-10">
              
              {/* Left Card (Rotated Behind) */}
              <div className="absolute left-0 lg:left-4 z-0 w-64 -rotate-6 transform rounded-2xl bg-white p-3 shadow-lg transition-transform hover:-rotate-2 dark:bg-dark border border-gray-100 dark:border-gray-800">
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-xl">
                  <Image src={placeholderImg} alt="Campaign" fill className="object-cover" />
                  <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                    <Icon icon="solar:drop-bold" /> Clean Water
                  </div>
                </div>
                <h4 className="mb-2 text-sm font-bold text-[#0F1F17] dark:text-white leading-tight">Clean Water for Rural Communities</h4>
                <p className="mb-3 text-[10px] text-gray-500 flex items-center gap-1"><Icon icon="solar:map-point-bold" /> Baidoa, Somalia</p>
                <div className="mb-1 text-sm font-black text-primary">$6,780 <span className="text-[10px] font-normal text-gray-500">raised</span></div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800"><div className="h-1.5 w-[65%] rounded-full bg-primary"></div></div>
              </div>

              {/* Right Card (Rotated Behind) */}
              <div className="absolute right-0 lg:right-4 z-0 w-64 rotate-6 transform rounded-2xl bg-white p-3 shadow-lg transition-transform hover:rotate-2 dark:bg-dark border border-gray-100 dark:border-gray-800">
                <div className="relative mb-3 h-32 w-full overflow-hidden rounded-xl">
                  <Image src={placeholderImg} alt="Campaign" fill className="object-cover" />
                  <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                    <Icon icon="solar:users-group-two-rounded-bold" /> Community
                  </div>
                </div>
                <h4 className="mb-2 text-sm font-bold text-[#0F1F17] dark:text-white leading-tight">Support Vulnerable Families</h4>
                <p className="mb-3 text-[10px] text-gray-500 flex items-center gap-1"><Icon icon="solar:map-point-bold" /> Hargeisa, Somalia</p>
                <div className="mb-1 text-sm font-black text-primary">$2,150 <span className="text-[10px] font-normal text-gray-500">raised</span></div>
                <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800"><div className="h-1.5 w-[30%] rounded-full bg-primary"></div></div>
              </div>

              {/* Center Card (Front) */}
              <div className="absolute z-10 w-[340px] transform rounded-2xl bg-white p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:bg-dark dark:shadow-black/50 border border-gray-100 dark:border-gray-700">
                <div className="relative mb-4 h-44 w-full overflow-hidden rounded-xl">
                  <Image src={placeholderImg} alt="Campaign" fill className="object-cover" />
                  <div className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white flex items-center gap-1 shadow-md">
                    <Icon icon="solar:diploma-bold" /> Education
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-bold leading-tight text-[#0F1F17] dark:text-white">Help Children Access Better Education</h3>
                <p className="mb-4 text-xs text-gray-500 flex items-center gap-1"><Icon icon="solar:map-point-bold" className="text-sm" /> Mogadishu, Somalia</p>
                
                <div className="mb-2 flex items-end justify-between">
                  <div>
                    <div className="text-xl font-black text-primary">$4,320</div>
                    <div className="text-[10px] text-gray-500">raised</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300">$10,000</div>
                    <div className="text-[10px] text-gray-500">goal</div>
                  </div>
                  <div className="text-lg font-black text-primary">43%</div>
                </div>
                
                <div className="mb-4 h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                  <div className="h-2 w-[43%] rounded-full bg-primary"></div>
                </div>

                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-400">
                  <span className="flex items-center gap-1.5"><Icon icon="solar:users-group-two-rounded-bold" className="text-primary text-sm" /> 86 supporters</span>
                  <span className="flex items-center gap-1.5"><Icon icon="solar:clock-circle-bold" className="text-primary text-sm" /> 25 days left</span>
                </div>

                <Button className="w-full rounded-xl bg-primary py-6 font-bold text-white hover:bg-primary/80">
                  <Icon icon="solar:heart-bold" className="mr-2 text-lg" /> Donate Now
                </Button>
              </div>

            </div>

            {/* Recent Donations Ticker directly below the cards */}
            <div className="relative z-20 w-full pl-4 pr-4 lg:pr-0">
              <HeroRecentDonations donations={recentDonations} />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default MainBanner;