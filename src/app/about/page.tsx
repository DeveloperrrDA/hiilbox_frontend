import Link from "next/link";
import { Icon } from "@iconify/react";
import ThemeShell from "@/components/theme/ThemeShell";

export const metadata = {
  title: "About Us | HiilBox",
  description: "Learn about HiilBox's mission to make fundraising accessible, trusted, and global.",
};

export default function AboutPage() {
  return (
    <ThemeShell>
      <main className="w-full bg-[#FAFAFA] text-[#0F1F17] dark:bg-dark dark:text-white">
        
        {/* =========================================
            HERO SECTION
        ========================================= */}
        <section className="relative w-full overflow-hidden bg-white py-16 dark:bg-darkgray md:py-24">
          <div className="absolute right-0 top-0 z-0 h-full w-[85%] rounded-l-[4rem] bg-[#E6F4EB] dark:bg-[#003D1B]/30 md:w-[60%] md:rounded-l-[8rem]"></div>
          
          <div className="absolute right-[15%] top-10 z-0 hidden h-32 w-32 text-[#8BD3A8]/50 dark:text-[#8BD3A8]/20 md:block">
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
              <pattern id="dots-hero-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.5"></circle></pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-hero-1)"></rect>
            </svg>
          </div>
          <div className="absolute bottom-10 left-[45%] z-0 hidden h-24 w-24 text-[#8BD3A8]/50 dark:text-[#8BD3A8]/20 md:block">
            <svg width="100%" height="100%" viewBox="0 0 100 100" fill="currentColor">
              <pattern id="dots-hero-2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2.5"></circle></pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#dots-hero-2)"></rect>
            </svg>
          </div>

          <div className="container-1218 relative z-10 flex flex-col items-center gap-12 px-6 lg:flex-row md:gap-20">
            <div className="flex w-full flex-col items-start lg:w-[45%]">
              <div className="mb-6 inline-flex items-center rounded-full border border-[#8BD3A8]/30 bg-[#E6F4EB] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#01A14B] shadow-sm dark:bg-[#01A14B]/10">
                <span>CROWDFUNDING PLATFORM</span>
              </div>
              
              <h1 className="mb-6 text-4xl font-black leading-[1.05] tracking-tight text-[#0F1F17] dark:text-white md:text-5xl lg:text-[4rem]">
                Making Fundraising <br className="hidden lg:block"/> <span className="text-[#01A14B]">Accessible</span>, Trusted, <br className="hidden lg:block"/> and Global
              </h1>
              
              <p className="mb-10 text-lg leading-relaxed text-[#687280] dark:text-gray-300">
                Our mission is to help people turn challenges into opportunities by providing a trusted crowdfunding platform where anyone can raise funds, receive donations securely, and inspire support from around the world.
              </p>
              
              <div className="flex w-full flex-col gap-4 sm:flex-col sm:w-auto">
                <Link href="/create-campaign" className="group inline-flex items-center justify-center space-x-2 rounded-full bg-[#01A14B] px-8 py-4 text-lg font-bold text-white shadow-lg shadow-[#01A14B]/30 transition hover:bg-[#006B30] dark:shadow-none">
                  <span>Start Your Campaign</span>
                  <Icon icon="solar:arrow-right-bold" className="transform transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/campaigns" className="group inline-flex items-center justify-center space-x-2 rounded-full border-2 border-[#01A14B] bg-white px-8 py-4 text-lg font-bold text-[#01A14B] transition hover:bg-[#E6F4EB] dark:bg-transparent dark:hover:bg-[#01A14B]/10">
                  <span>Explore Success Stories</span>
                  <Icon icon="solar:arrow-right-bold" className="transform transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            
            <div className="relative z-10 mt-8 flex w-full justify-center lg:mt-0 lg:w-[55%] lg:justify-end">
              <img src="https://cms.hiilbox.com/about/fundraising_campaigns_in_action.png" alt="Fundraising Campaigns in Action" className="h-auto w-full max-w-[700px] object-contain drop-shadow-2xl transition-transform duration-500 hover:-translate-y-2" />
            </div>
          </div>
        </section>

        {/* =========================================
            WHY CHOOSE US (DARK BACKGROUND + GLASS CARDS)
        ========================================= */}
        <section className="relative w-full overflow-hidden bg-[#0F1F17] py-24 px-6 text-white">
          {/* Ambient Glowing Blobs */}
          <div className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#01A14B] opacity-20 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/2 translate-y-1/2 rounded-full bg-[#8BD3A8] opacity-10 blur-[120px] pointer-events-none"></div>
          
          <div className="container-1218 relative z-10">
            <div className="relative mb-16 flex flex-col items-center text-center">
              <div className="mb-6 rounded-full bg-[#01A14B]/20 px-5 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#8BD3A8] border border-[#01A14B]/30">
                Why Choose Us
              </div>
              
              <h2 className="relative mb-4 inline-block mx-auto max-w-4xl text-3xl font-black leading-tight text-white md:text-[2.75rem]">
                Built on trust, transparency, and <span className="text-[#01A14B]">accountability</span>
              </h2>
              
              <p className="mx-auto mb-6 max-w-3xl text-lg text-white/70">
                We are committed to creating a safe, transparent, and reliable crowdfunding platform that empowers communities and connects them with global support.
              </p>
              <div className="mx-auto h-1.5 w-10 rounded-full bg-[#01A14B]"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              
              {/* Feature 1: Global Reach */}
              <div className="relative flex h-[180px] items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-white/20">
                <div className="z-10 w-[55%]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30">
                      <Icon icon="solar:global-bold" className="text-xl text-[#8BD3A8]" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Global Reach</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-white/70">Supporters from around the world can discover and contribute to campaigns that matter to them.</p>
                </div>
                <div className="absolute right-0 top-1/2 flex h-40 w-40 -translate-y-1/2 shrink-0 items-center justify-center">
                  <div className="flex h-24 w-24 animate-[spin_20s_linear_infinite] items-center justify-center rounded-full border border-dashed border-[#8BD3A8]/50">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm">
                      <Icon icon="solar:global-bold" className="text-4xl text-[#8BD3A8] opacity-50" />
                    </div>
                  </div>
                  <div className="absolute right-6 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[10px] text-white shadow-md backdrop-blur-md"><Icon icon="solar:user-bold" /></div>
                  <div className="absolute bottom-6 left-6 flex h-7 w-7 items-center justify-center rounded-full border border-[#01A14B]/50 bg-[#01A14B] text-[12px] text-white shadow-md"><Icon icon="solar:user-bold" /></div>
                  <div className="absolute left-2 top-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-[#8BD3A8] text-[8px] text-white shadow-sm"><Icon icon="solar:user-bold" /></div>
                </div>
              </div>
              
              {/* Feature 2: Trusted Platform */}
              <div className="relative flex h-[180px] items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-white/20">
                <div className="z-10 w-[55%]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30">
                      <Icon icon="solar:shield-check-bold" className="text-xl text-[#8BD3A8]" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Trusted Platform</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-white/70">We are committed to building trust through transparency, accountability, and responsible fund management.</p>
                </div>
                <div className="absolute right-2 top-1/2 flex h-32 w-32 -translate-y-1/2 shrink-0 items-center justify-center">
                  <div className="relative z-10 flex h-24 w-20 rotate-6 transform flex-col rounded-lg border border-white/10 bg-white/5 p-2.5 shadow-sm backdrop-blur-md">
                    <div className="mb-2 h-1.5 w-6 rounded bg-white/50"></div>
                    <div className="mb-1.5 h-1.5 w-full rounded bg-white/30"></div>
                    <div className="mb-1.5 h-1.5 w-3/4 rounded bg-white/30"></div>
                    <div className="h-1.5 w-full rounded bg-white/30"></div>
                  </div>
                  <div className="absolute -right-2 bottom-2 z-20 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white/20 bg-[#01A14B] text-white shadow-lg backdrop-blur-md">
                    <Icon icon="solar:check-read-bold" className="text-xl" />
                  </div>
                </div>
              </div>
              
              {/* Feature 3: Secure Donations */}
              <div className="relative flex h-[180px] items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-white/20">
                <div className="z-10 w-[55%]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30">
                      <Icon icon="solar:lock-password-bold" className="text-xl text-[#8BD3A8]" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Secure Donations</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-white/70">We utilize modern security standards and trusted payment technologies to help protect your transactions.</p>
                </div>
                <div className="absolute right-4 top-1/2 flex h-32 w-32 -translate-y-1/2 shrink-0 items-center justify-center">
                  <div className="relative z-10 flex h-24 w-[5.5rem] items-center justify-center rounded-b-xl rounded-t-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                    <div className="absolute inset-1.5 rounded-b-lg rounded-t-full border border-white/20 bg-[#01A14B]/40"></div>
                    <Icon icon="solar:check-circle-bold" className="text-3xl text-white z-10" />
                  </div>
                  <Icon icon="solar:stars-bold" className="absolute right-2 top-4 text-lg text-[#8BD3A8]" />
                  <Icon icon="solar:stars-bold" className="absolute bottom-4 left-2 text-base text-[#8BD3A8]" />
                </div>
              </div>

              {/* Feature 4: Easy to Use */}
              <div className="relative flex h-[180px] items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-white/20">
                <div className="z-10 w-[55%]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30">
                      <Icon icon="solar:cursor-square-bold" className="text-xl text-[#8BD3A8]" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Easy to Use</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-white/70">Our platform is designed to make fundraising and donating simple, intuitive, and accessible for everyone.</p>
                </div>
                <div className="absolute right-2 top-1/2 flex h-32 w-36 -translate-y-1/2 shrink-0 items-center justify-center">
                  <div className="relative z-10 flex h-20 w-28 flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-2 shadow-sm backdrop-blur-md">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#8BD3A8]/70"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-[#8BD3A8]/70"></div>
                      <div className="h-1.5 w-1.5 rounded-full bg-[#8BD3A8]/70"></div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-white/50"></div>
                      <div className="h-2 w-3/4 rounded-full bg-white/30"></div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-white/20 bg-[#01A14B] text-white shadow-lg backdrop-blur-md">
                    <Icon icon="solar:add-circle-bold" className="text-xl" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 z-30 -rotate-12 transform text-[#8BD3A8]">
                    <Icon icon="solar:cursor-bold" className="text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]" />
                  </div>
                </div>
              </div>

              {/* Feature 5: Real-Time Tracking */}
              <div className="relative flex h-[180px] items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-white/20">
                <div className="z-10 w-[55%]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30">
                      <Icon icon="solar:chart-square-bold" className="text-xl text-[#8BD3A8]" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Real-Time Tracking</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-white/70">Fundraisers and donors can monitor campaign progress and fundraising performance in real time.</p>
                </div>
                <div className="absolute right-4 top-1/2 flex h-32 w-32 -translate-y-1/2 shrink-0 items-center justify-center">
                  <div className="relative z-10 flex h-24 w-28 items-end gap-1.5 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
                    <div className="h-8 w-4 rounded-t bg-[#8BD3A8] shadow-sm opacity-60"></div>
                    <div className="h-12 w-4 rounded-t bg-[#8BD3A8] shadow-sm opacity-80"></div>
                    <div className="h-16 w-4 rounded-t bg-[#01A14B] shadow-sm"></div>
                  </div>
                  <div className="absolute -right-1 bottom-2 z-20 flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-white/20 bg-[#01A14B] text-white shadow-lg backdrop-blur-md">
                    <Icon icon="solar:history-bold" className="text-xl" />
                  </div>
                </div>
              </div>

              {/* Feature 6: Dedicated Support */}
              <div className="relative flex h-[180px] items-center justify-between gap-4 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-white/20">
                <div className="z-10 w-[55%]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30">
                      <Icon icon="solar:chat-round-dots-bold" className="text-xl text-[#8BD3A8]" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Dedicated Support</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-white/70">Our customer support team is available to assist fundraisers and donors throughout their journey.</p>
                </div>
                <div className="absolute right-4 top-1/2 flex h-32 w-32 -translate-y-1/2 shrink-0 items-center justify-center">
                  <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-[1.5rem] rounded-br-lg border border-[#01A14B]/50 bg-[#01A14B]/40 text-white shadow-lg backdrop-blur-md">
                    <Icon icon="solar:menu-dots-bold" className="text-4xl opacity-80" />
                    <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl rounded-bl-sm border border-white/20 bg-white/10 text-white shadow-md backdrop-blur-lg">
                      <Icon icon="solar:chat-square-text-bold" className="text-xl" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================
            PAYMENT & PAYOUTS
        ========================================= */}
        <section className="relative w-full overflow-hidden border-y border-gray-100 bg-white py-24 px-6 dark:border-gray-800 dark:bg-dark">
          <div className="absolute left-0 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E6F4EB] opacity-40 blur-[100px] pointer-events-none dark:bg-[#01A14B]/10"></div>
          
          <div className="container-1218 relative z-10">
            <div className="mb-20 flex flex-col items-center gap-16 lg:flex-row">
              <div className="flex w-full flex-col items-start lg:w-[40%]">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#E6F4EB] px-5 py-2 text-xs font-bold uppercase tracking-[0.1em] text-[#01A14B] dark:bg-[#01A14B]/10">
                  <Icon icon="solar:wallet-bold" /> PAYMENT & PAYOUTS
                </div>
                
                <h2 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-[#0F1F17] dark:text-white md:text-5xl lg:text-[3.5rem]">
                  Multiple Payment Options, <br/><span className="text-[#01A14B]">Directly to You</span>
                </h2>
                
                <p className="mb-8 max-w-md text-lg leading-relaxed text-[#687280] dark:text-gray-300">
                  HiilBox securely receives and manages all donations through multiple local and international payment methods, and transfers the collected funds directly to your bank account when you request a withdrawal.
                </p>
                
                <Link href="/create-campaign" className="group mb-8 inline-flex items-center justify-center rounded-full bg-[#01A14B] px-8 py-4 text-lg font-bold text-white shadow-[0_8px_20px_-8px_rgba(1,161,75,0.4)] transition hover:bg-[#006B30] dark:shadow-none">
                  <span>Start a Campaign</span>
                  <Icon icon="solar:arrow-right-bold" className="ml-2 transform transition-transform group-hover:translate-x-1" />
                </Link>
                
                {/* Social Proof */}
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    <img src="https://placehold.co/40x40/E6F4EB/01A14B?text=U1" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-dark" alt="User" />
                    <img src="https://placehold.co/40x40/D1FADF/006B30?text=U2" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-dark" alt="User" />
                    <img src="https://placehold.co/40x40/8BD3A8/0F1F17?text=U3" className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm dark:border-dark" alt="User" />
                  </div>
                  <p className="text-sm font-bold text-[#0F1F17] dark:text-white"><span className="text-[#01A14B]">15,000+</span> fundraisers trust us</p>
                </div>
              </div>

              <div className="relative flex w-full justify-center lg:w-[60%] lg:justify-end">
                <img src="https://cms.hiilbox.com/about/secure_donation_payment_flow.png" alt="Secure Donation Payment Flow" className="h-auto w-full object-contain" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] dark:border-gray-800 dark:bg-darkgray sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "solar:shield-check-bold", title: "Secure Payments", desc: "Donations processed safely with trusted providers." },
                { icon: "solar:settings-bold", title: "Multiple Options", desc: "Local and international methods available." },
                { icon: "solar:wad-of-money-bold", title: "Fund Management", desc: "We manage all donations on your behalf." },
                { icon: "solar:banknote-bold", title: "Easy Withdrawals", desc: "Receive funds directly to your bank account." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E6F4EB] dark:bg-[#01A14B]/10">
                    <Icon icon={item.icon} className="text-2xl text-[#01A14B]" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-bold text-[#0F1F17] dark:text-white">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-[#687280] dark:text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            WHO WE SERVE (DARK BACKGROUND + GLASS CARDS)
        ========================================= */}
        <section className="relative w-full overflow-hidden bg-[#0F1F17] py-24 px-6 text-white">
          <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-[#01A14B] opacity-10 blur-[120px] pointer-events-none"></div>
          
          <div className="container-1218 relative z-10">
            <div className="relative mb-16 flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30 px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#8BD3A8]">
                OUR CATEGORIES
              </div>
              <h2 className="mb-6 text-4xl font-black text-white md:text-[2.75rem]">
                Who <span className="text-[#01A14B]">We Serve</span>
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-lg text-white/70">
                HiilBox supports a wide range of fundraising needs, connecting generosity to where it matters most.
              </p>
              <div className="h-1.5 w-10 rounded-full bg-[#01A14B]"></div>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: "solar:heart-pulse-bold", title: "Medical &\nHealthcare", desc: "Support medical treatment and surgeries for families.", slug: "health", image: "https://cms.hiilbox.com/about/who-we-serve/medical-healthcare_causes_who-we-serve-Hiilbox.webp" },
                { icon: "solar:diploma-bold", title: "Education &\nScholarships", desc: "Help students access quality education for a brighter future.", slug: "education", image: "https://cms.hiilbox.com/about/who-we-serve/education-scholarships_causes_who-we-serve-Hiilbox.webp" },
                { icon: "solar:danger-triangle-bold", title: "Emergency\nRelief", desc: "Provide urgent support during natural disasters.", slug: "emergency", image: "https://cms.hiilbox.com/about/who-we-serve/emergency-relief_causes_who-we-serve-Hiilbox.webp" },
                { icon: "solar:hand-stars-bold", title: "Humanitarian\nAssistance", desc: "Support vulnerable communities across Somalia.", slug: "humanitarian", image: "https://cms.hiilbox.com/about/who-we-serve/humanitarian_causes_who-we-serve-Hiilbox.webp" },
                { icon: "solar:buildings-bold", title: "Community\nProjects", desc: "Fund local development projects that create lasting change.", slug: "community", image: "https://cms.hiilbox.com/about/who-we-serve/community-projects_causes_who-we-serve-Hiilbox.webp" },
                { icon: "solar:hand-heart-bold", title: "Non-profit\nInitiatives", desc: "Support NGOs and non-profit organizations driving social impact.", slug: "non-profit", image: "https://cms.hiilbox.com/about/who-we-serve/non-profit_causes_who-we-serve-Hiilbox.webp" },
                { icon: "solar:mosque-bold", title: "Religious\nCauses", desc: "Support mosque construction and religious education.", slug: "masjid", image: "https://cms.hiilbox.com/about/who-we-serve/religious_causes_who-we-serve-Hiilbox.webp" },
                { icon: "solar:leaf-bold", title: "Environmental", desc: "Contribute to environmental protection and sustainable initiatives for a greener tomorrow.", slug: "environment", image: "https://cms.hiilbox.com/about/who-we-serve/environmental_causes_who-we-serve-Hiilbox.webp" },
              ].map((cat, i) => (
                <div key={i} className="group relative flex min-h-[240px] items-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all hover:bg-white/10 hover:border-white/20">
                  <div className="relative z-10 flex h-full w-[55%] flex-col justify-between">
                    <div>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#01A14B]/20 border border-[#01A14B]/30">
                          <Icon icon={cat.icon} className="text-2xl text-[#8BD3A8]" />
                        </div>
                        <h4 className="whitespace-pre-line text-lg font-bold leading-tight text-white">{cat.title}</h4>
                      </div>
                      <p className="mb-6 text-sm leading-relaxed text-white/70">{cat.desc}</p>
                    </div>
                    <Link href={`/campaigns?category=${cat.slug}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-[#01A14B] hover:text-white">
                      <Icon icon="solar:arrow-right-bold" />
                    </Link>
                  </div>
                  
                  <div className="absolute right-[-10%] top-1/2 z-0 flex aspect-square w-[55%] -translate-y-1/2 items-center justify-center">
                    <div className="absolute inset-0 scale-110 bg-[#01A14B]/20 transition-transform duration-500 group-hover:scale-125" style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}></div>
                    <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-white/20 bg-white/5 backdrop-blur-sm shadow-sm" style={{ backgroundImage: `url('${cat.image}')`, backgroundSize: "cover", backgroundPosition: "center" }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================
            TRUST & SECURITY
        ========================================= */}
        <section className="w-full px-6 py-12">
          <div className="container-1218">
            <div className="relative flex flex-col items-center justify-between gap-12 overflow-hidden rounded-4xl bg-[#003D1B] p-10 md:flex-row md:p-16">
              <div className="relative z-10 md:w-1/2">
                <span className="mb-4 block text-sm font-bold uppercase tracking-wider text-[#8BD3A8]">Trust & Security</span>
                <h2 className="mb-6 text-3xl font-black text-white md:text-4xl">Transparency & Accountability</h2>
                <p className="text-lg leading-relaxed text-gray-300">
                  We continuously work to strengthen our platform, improve user confidence, and ensure that contributions reach their intended purpose responsibly and efficiently.
                </p>
              </div>
              
              <div className="relative z-10 rounded-3xl border border-gray-700 bg-[#0F1F17] p-8 md:w-1/2">
                <ul className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  {[
                    "Verified Campaigns", "Multi-Currency Support", "Identity Verification (KYC)",
                    "Transparent Reporting", "Secure Payment", "Donor Protection",
                    "Real-Time Tracking", "24/7 Support"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3 text-white">
                      <Icon icon="solar:check-circle-bold" className="text-xl text-[#01A14B]" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================
            IMPACT GOAL CTA
        ========================================= */}
        <section className="relative w-full overflow-hidden bg-white py-24 px-6 dark:bg-darkgray">
          <div className="container-1218 relative z-10 text-center">
            <div className="mx-auto max-w-4xl">
              <div className="mx-auto mb-8 flex h-20 w-20 rotate-12 transform items-center justify-center rounded-3xl bg-[#E6F4EB] dark:bg-[#01A14B]/10">
                <Icon icon="solar:stars-bold" className="text-4xl -rotate-12 transform text-[#01A14B]" />
              </div>
              <h2 className="mb-6 text-4xl font-black text-[#0F1F17] dark:text-white md:text-5xl">Our Impact Goal</h2>
              <p className="mb-12 text-xl leading-relaxed text-[#687280] dark:text-gray-300">
                To create a future where financial support can reach anyone who needs it, regardless of where they live. We aim to unlock opportunities, accelerate social impact, and build a culture of giving that transforms lives.
              </p>
              
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/create-campaign" className="rounded-full bg-[#01A14B] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-[#006B30] dark:shadow-none">
                  Start your Campaign
                </Link>
                <Link href="/campaigns" className="rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-lg font-bold text-[#0F1F17] transition hover:border-[#01A14B] hover:text-[#01A14B] dark:border-gray-700 dark:bg-dark dark:text-white dark:hover:border-[#01A14B] dark:hover:text-[#01A14B]">
                  Explore Causes
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </ThemeShell>
  );
}